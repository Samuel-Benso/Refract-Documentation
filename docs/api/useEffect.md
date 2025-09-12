# useEffect

The `useEffect` hook handles side effects and lifecycle management in Refract components. It provides a declarative way to perform operations like data fetching, subscriptions, timers, and DOM manipulation while ensuring proper cleanup and dependency tracking.

## Syntax

```javascript
lens.useEffect(effect, dependencies?)
```

## Parameters

### `effect`
- **Type:** `() => void | (() => void)`
- **Required:** Yes
- **Description:** Function that contains side effect logic. Can optionally return a cleanup function.

### `dependencies`
- **Type:** `any[] | undefined`
- **Required:** No
- **Description:** Array of values that the effect depends on. Effect re-runs when dependencies change.

## Return Value

Returns `void`. The effect function can optionally return a cleanup function.

## Basic Usage

### Mount Effect

```javascript
const MountExample = createComponent(({ lens }) => {
  const data = lens.useRefraction(null);
  
  // Runs once when component mounts
  lens.useEffect(() => {
    console.log('Component mounted');
    
    fetchInitialData().then(data.set);
    
    // Optional cleanup on unmount
    return () => {
      console.log('Component unmounting');
    };
  }, []); // Empty dependency array = mount only
  
  return <div>{data.value || 'Loading...'}</div>;
});
```

### Dependency-Based Effects

```javascript
const DependencyExample = createComponent(({ lens, userId }) => {
  const user = lens.useRefraction(null);
  const loading = lens.useRefraction(false);
  
  // Runs when userId changes
  lens.useEffect(() => {
    if (!userId) return;
    
    loading.set(true);
    
    fetchUser(userId)
      .then(user.set)
      .finally(() => loading.set(false));
  }, [userId]); // Runs when userId prop changes
  
  return (
    <div>
      {loading.value ? 'Loading...' : user.value?.name}
    </div>
  );
});
```

### State-Dependent Effects

```javascript
const StateEffect = createComponent(({ lens }) => {
  const searchQuery = lens.useRefraction('');
  const results = lens.useRefraction([]);
  
  // Runs when searchQuery changes
  lens.useEffect(() => {
    if (searchQuery.value.length < 3) {
      results.set([]);
      return;
    }
    
    const searchTimeout = setTimeout(() => {
      performSearch(searchQuery.value).then(results.set);
    }, 300);
    
    // Cleanup timeout on next effect run
    return () => clearTimeout(searchTimeout);
  }, [searchQuery.value]);
  
  return (
    <div>
      <input
        value={searchQuery.value}
        onChange={(e) => searchQuery.set(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.value.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
});
```

## Advanced Patterns

### Async Effects

```javascript
const AsyncEffect = createComponent(({ lens, productId }) => {
  const product = lens.useRefraction(null);
  const loading = lens.useRefraction(false);
  const error = lens.useRefraction(null);
  
  lens.useEffect(() => {
    let cancelled = false;
    
    const loadProduct = async () => {
      loading.set(true);
      error.set(null);
      
      try {
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        
        const productData = await response.json();
        
        // Only update state if effect hasn't been cancelled
        if (!cancelled) {
          product.set(productData);
        }
      } catch (err) {
        if (!cancelled) {
          error.set(err.message);
        }
      } finally {
        if (!cancelled) {
          loading.set(false);
        }
      }
    };
    
    loadProduct();
    
    // Cleanup: cancel the async operation
    return () => {
      cancelled = true;
    };
  }, [productId]);
  
  if (loading.value) return <div>Loading product...</div>;
  if (error.value) return <div>Error: {error.value}</div>;
  if (!product.value) return <div>Product not found</div>;
  
  return (
    <div>
      <h2>{product.value.name}</h2>
      <p>{product.value.description}</p>
      <p>Price: ${product.value.price}</p>
    </div>
  );
});
```

### Event Listeners

```javascript
const EventListenerEffect = createComponent(({ lens }) => {
  const windowSize = lens.useRefraction({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const mousePosition = lens.useRefraction({ x: 0, y: 0 });
  const isTracking = lens.useRefraction(false);
  
  // Window resize listener
  lens.useEffect(() => {
    const handleResize = () => {
      windowSize.set({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Mouse tracking (conditional)
  lens.useEffect(() => {
    if (!isTracking.value) return;
    
    const handleMouseMove = (event) => {
      mousePosition.set({
        x: event.clientX,
        y: event.clientY
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTracking.value]);
  
  return (
    <div>
      <p>Window: {windowSize.value.width} x {windowSize.value.height}</p>
      <button onClick={() => isTracking.set(!isTracking.value)}>
        {isTracking.value ? 'Stop' : 'Start'} Mouse Tracking
      </button>
      {isTracking.value && (
        <p>Mouse: ({mousePosition.value.x}, {mousePosition.value.y})</p>
      )}
    </div>
  );
});
```

### Subscriptions and WebSockets

```javascript
const WebSocketEffect = createComponent(({ lens, roomId }) => {
  const messages = lens.useRefraction([]);
  const connectionStatus = lens.useRefraction('disconnected');
  
  lens.useEffect(() => {
    if (!roomId) return;
    
    connectionStatus.set('connecting');
    
    const ws = new WebSocket(`ws://localhost:8080/rooms/${roomId}`);
    
    ws.onopen = () => {
      connectionStatus.set('connected');
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      messages.set(prev => [...prev, message]);
    };
    
    ws.onclose = () => {
      connectionStatus.set('disconnected');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      connectionStatus.set('error');
    };
    
    // Cleanup: close WebSocket connection
    return () => {
      ws.close();
    };
  }, [roomId]);
  
  const sendMessage = (text) => {
    // Implementation would depend on WebSocket state
    console.log('Sending message:', text);
  };
  
  return (
    <div>
      <div>Status: {connectionStatus.value}</div>
      <div>
        {messages.value.map(msg => (
          <div key={msg.id}>{msg.user}: {msg.text}</div>
        ))}
      </div>
    </div>
  );
});
```

### Timers and Intervals

```javascript
const TimerEffect = createComponent(({ lens }) => {
  const time = lens.useRefraction(new Date());
  const isRunning = lens.useRefraction(false);
  const countdown = lens.useRefraction(60);
  
  // Clock timer
  lens.useEffect(() => {
    if (!isRunning.value) return;
    
    const interval = setInterval(() => {
      time.set(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning.value]);
  
  // Countdown timer
  lens.useEffect(() => {
    if (countdown.value <= 0) return;
    
    const timer = setTimeout(() => {
      countdown.set(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown.value]);
  
  return (
    <div>
      <div>
        <h3>Clock</h3>
        <p>{time.value.toLocaleTimeString()}</p>
        <button onClick={() => isRunning.set(!isRunning.value)}>
          {isRunning.value ? 'Stop' : 'Start'} Clock
        </button>
      </div>
      
      <div>
        <h3>Countdown</h3>
        <p>{countdown.value} seconds</p>
        <button onClick={() => countdown.set(60)}>
          Reset Countdown
        </button>
      </div>
    </div>
  );
});
```

## Effect Dependencies

### Dependency Array Rules

```javascript
const DependencyRules = createComponent(({ lens, userId, config }) => {
  const data = lens.useRefraction(null);
  
  // ✅ Good - Specific dependencies
  lens.useEffect(() => {
    fetchUserData(userId, config.apiKey).then(data.set);
  }, [userId, config.apiKey]);
  
  // ❌ Bad - Missing dependencies
  lens.useEffect(() => {
    fetchUserData(userId, config.apiKey).then(data.set);
  }, [userId]); // Missing config.apiKey
  
  // ❌ Bad - Unnecessary dependencies
  lens.useEffect(() => {
    fetchUserData(userId).then(data.set);
  }, [userId, config]); // config not used in effect
  
  return <div>{data.value?.name}</div>;
});
```

### Memoizing Dependencies

```javascript
const MemoizedDependencies = createComponent(({ lens, items }) => {
  const processedItems = lens.useRefraction([]);
  
  // Memoize expensive computation for dependency
  const itemIds = lens.useDerived(() => 
    items.map(item => item.id).join(','), 
    [items]
  );
  
  lens.useEffect(() => {
    // Only runs when item IDs change, not when other item properties change
    const processed = items.map(processItem);
    processedItems.set(processed);
  }, [itemIds.value]);
  
  return (
    <ul>
      {processedItems.value.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});
```

## Error Handling

### Try-Catch in Effects

```javascript
const ErrorHandlingEffect = createComponent(({ lens }) => {
  const data = lens.useRefraction(null);
  const error = lens.useRefraction(null);
  const loading = lens.useRefraction(false);
  
  lens.useEffect(() => {
    const loadData = async () => {
      try {
        loading.set(true);
        error.set(null);
        
        const result = await riskyAsyncOperation();
        data.set(result);
      } catch (err) {
        console.error('Effect error:', err);
        error.set(err.message);
      } finally {
        loading.set(false);
      }
    };
    
    loadData();
  }, []);
  
  if (loading.value) return <div>Loading...</div>;
  if (error.value) return <div>Error: {error.value}</div>;
  
  return <div>{JSON.stringify(data.value)}</div>;
});
```

### Effect Error Boundaries

```javascript
const withEffectErrorHandling = (Component) => {
  return createComponent((props) => {
    const { lens } = props;
    const hasEffectError = lens.useRefraction(false);
    const effectError = lens.useRefraction(null);
    
    // Wrap effects with error handling
    const safeUseEffect = (effect, deps) => {
      lens.useEffect(() => {
        try {
          const cleanup = effect();
          return cleanup;
        } catch (error) {
          hasEffectError.set(true);
          effectError.set(error);
        }
      }, deps);
    };
    
    if (hasEffectError.value) {
      return (
        <div className="effect-error">
          <h3>Effect Error</h3>
          <p>{effectError.value?.message}</p>
          <button onClick={() => hasEffectError.set(false)}>
            Retry
          </button>
        </div>
      );
    }
    
    return <Component {...props} useEffect={safeUseEffect} />;
  });
};
```

## Performance Optimization

### Conditional Effects

```javascript
const ConditionalEffect = createComponent(({ lens, isEnabled, shouldFetch }) => {
  const data = lens.useRefraction(null);
  
  lens.useEffect(() => {
    // Only run effect when conditions are met
    if (!isEnabled || !shouldFetch) return;
    
    fetchData().then(data.set);
  }, [isEnabled, shouldFetch]);
  
  return <div>{data.value || 'No data'}</div>;
});
```

### Debounced Effects

```javascript
const DebouncedEffect = createComponent(({ lens }) => {
  const searchTerm = lens.useRefraction('');
  const results = lens.useRefraction([]);
  
  lens.useEffect(() => {
    if (!searchTerm.value) {
      results.set([]);
      return;
    }
    
    // Debounce the search
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm.value).then(results.set);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm.value]);
  
  return (
    <div>
      <input
        value={searchTerm.value}
        onChange={(e) => searchTerm.set(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.value.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
});
```

## Testing Effects

### Mocking Effects

```javascript
import { render, waitFor } from '@refract/testing-utils';

// Mock fetch for testing
global.fetch = jest.fn();

describe('AsyncEffect Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  
  test('fetches data on mount', async () => {
    const mockData = { id: 1, name: 'Test Product' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });
    
    const { getByText } = render(<AsyncEffect productId={1} />);
    
    // Initially shows loading
    expect(getByText('Loading product...')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(getByText('Test Product')).toBeInTheDocument();
    });
    
    expect(fetch).toHaveBeenCalledWith('/api/products/1');
  });
  
  test('handles fetch errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    const { getByText } = render(<AsyncEffect productId={1} />);
    
    await waitFor(() => {
      expect(getByText('Error: Network error')).toBeInTheDocument();
    });
  });
});
```

### Testing Cleanup

```javascript
test('cleans up event listeners on unmount', () => {
  const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
  
  const { unmount } = render(<EventListenerEffect />);
  
  expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  
  unmount();
  
  expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  
  addEventListenerSpy.mockRestore();
  removeEventListenerSpy.mockRestore();
});
```

## Best Practices

### 1. Always Handle Cleanup
```javascript
// ✅ Good
lens.useEffect(() => {
  const subscription = api.subscribe(handleData);
  return () => subscription.unsubscribe();
}, []);

// ❌ Bad - No cleanup
lens.useEffect(() => {
  api.subscribe(handleData);
}, []);
```

### 2. Use Specific Dependencies
```javascript
// ✅ Good
lens.useEffect(() => {
  fetchUser(userId);
}, [userId]);

// ❌ Bad - Missing dependencies
lens.useEffect(() => {
  fetchUser(userId);
}, []);
```

### 3. Handle Async Operations Safely
```javascript
// ✅ Good
lens.useEffect(() => {
  let cancelled = false;
  
  fetchData().then(data => {
    if (!cancelled) {
      setData(data);
    }
  });
  
  return () => {
    cancelled = true;
  };
}, []);

// ❌ Bad - Race conditions possible
lens.useEffect(() => {
  fetchData().then(setData);
}, []);
```

### 4. Separate Concerns
```javascript
// ✅ Good - Separate effects for different concerns
lens.useEffect(() => {
  fetchUserData(userId).then(setUser);
}, [userId]);

lens.useEffect(() => {
  trackPageView(pageName);
}, [pageName]);

// ❌ Bad - Mixed concerns
lens.useEffect(() => {
  fetchUserData(userId).then(setUser);
  trackPageView(pageName);
}, [userId, pageName]);
```

## Related APIs

- **[useFlash](./useFlash)** - Post-render effects for animations
- **[useOptic](./useOptic)** - Reusable logic patterns
- **[useRefraction](./useRefraction)** - State that effects can respond to
- **[createComponent](./createComponent)** - Components that use effects
