# Effects

Effects in Refract handle side effects and lifecycle management within components. They provide a clean, declarative way to manage asynchronous operations, subscriptions, timers, and other side effects while ensuring proper cleanup and dependency tracking.

## Understanding Effects

Effects are functions that run in response to component lifecycle events or dependency changes. They're similar to React's `useEffect` but designed specifically for Refract's reactive system.

```javascript
import { createComponent } from 'refract';

const EffectExample = createComponent(({ lens }) => {
  const data = lens.useRefraction(null);
  
  // Effect runs after component mounts
  lens.useEffect(() => {
    console.log('Component mounted');
    
    // Cleanup function (optional)
    return () => {
      console.log('Component unmounting');
    };
  }, []); // Empty dependency array = run once on mount
  
  // Effect runs when data changes
  lens.useEffect(() => {
    if (data.value) {
      console.log('Data updated:', data.value);
    }
  }, [data.value]); // Runs when data.value changes
  
  return <div>Effect Example</div>;
});
```

## Effect Types

### Mount Effects

Run once when the component mounts:

```javascript
const MountEffect = createComponent(({ lens }) => {
  const user = lens.useRefraction(null);
  
  lens.useEffect(() => {
    // Runs once on mount
    fetchUserProfile().then(user.set);
    
    // Optional cleanup
    return () => {
      console.log('Cleaning up user data');
    };
  }, []); // Empty dependency array
  
  return <div>{user.value?.name || 'Loading...'}</div>;
});
```

### Update Effects

Run when specific dependencies change:

```javascript
const UpdateEffect = createComponent(({ lens, userId }) => {
  const user = lens.useRefraction(null);
  const loading = lens.useRefraction(false);
  
  lens.useEffect(() => {
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

### Cleanup Effects

Handle resource cleanup when components unmount or dependencies change:

```javascript
const CleanupEffect = createComponent(({ lens }) => {
  const messages = lens.useRefraction([]);
  
  lens.useEffect(() => {
    // Set up subscription
    const subscription = messageService.subscribe((message) => {
      messages.set(prev => [...prev, message]);
    });
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <div>
      {messages.value.map(msg => (
        <div key={msg.id}>{msg.text}</div>
      ))}
    </div>
  );
});
```

## Advanced Effect Patterns

### Async Effects

Handle asynchronous operations safely:

```javascript
const AsyncEffect = createComponent(({ lens, searchQuery }) => {
  const results = lens.useRefraction([]);
  const loading = lens.useRefraction(false);
  const error = lens.useRefraction(null);
  
  lens.useEffect(() => {
    if (!searchQuery) {
      results.set([]);
      return;
    }
    
    loading.set(true);
    error.set(null);
    
    // Use AbortController for cleanup
    const abortController = new AbortController();
    
    const performSearch = async () => {
      try {
        const response = await fetch(`/api/search?q=${searchQuery}`, {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Only update if not aborted
        if (!abortController.signal.aborted) {
          results.set(data.results);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          error.set(err.message);
        }
      } finally {
        if (!abortController.signal.aborted) {
          loading.set(false);
        }
      }
    };
    
    performSearch();
    
    // Cleanup: abort the request
    return () => {
      abortController.abort();
    };
  }, [searchQuery]);
  
  return (
    <div>
      {loading.value && <div>Searching...</div>}
      {error.value && <div>Error: {error.value}</div>}
      {results.value.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
});
```

### Debounced Effects

Delay effect execution until dependencies stabilize:

```javascript
const DebouncedEffect = createComponent(({ lens }) => {
  const searchTerm = lens.useRefraction('');
  const debouncedTerm = lens.useRefraction('');
  const results = lens.useRefraction([]);
  
  // Debounce the search term
  lens.useEffect(() => {
    const timer = setTimeout(() => {
      debouncedTerm.set(searchTerm.value);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm.value]);
  
  // Perform search when debounced term changes
  lens.useEffect(() => {
    if (debouncedTerm.value) {
      performSearch(debouncedTerm.value).then(results.set);
    } else {
      results.set([]);
    }
  }, [debouncedTerm.value]);
  
  return (
    <div>
      <input
        value={searchTerm.value}
        onChange={(e) => searchTerm.set(e.target.value)}
        placeholder="Search..."
      />
      <div>
        {results.value.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  );
});
```

### Interval Effects

Handle recurring operations:

```javascript
const IntervalEffect = createComponent(({ lens }) => {
  const time = lens.useRefraction(new Date());
  const isActive = lens.useRefraction(true);
  
  lens.useEffect(() => {
    if (!isActive.value) return;
    
    const interval = setInterval(() => {
      time.set(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isActive.value]);
  
  return (
    <div>
      <p>Current time: {time.value.toLocaleTimeString()}</p>
      <button onClick={() => isActive.set(!isActive.value)}>
        {isActive.value ? 'Stop' : 'Start'} Clock
      </button>
    </div>
  );
});
```

### Event Listener Effects

Manage DOM event listeners:

```javascript
const EventListenerEffect = createComponent(({ lens }) => {
  const mousePosition = lens.useRefraction({ x: 0, y: 0 });
  const isTracking = lens.useRefraction(false);
  
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
      <button onClick={() => isTracking.set(!isTracking.value)}>
        {isTracking.value ? 'Stop' : 'Start'} Tracking
      </button>
      {isTracking.value && (
        <p>Mouse: ({mousePosition.value.x}, {mousePosition.value.y})</p>
      )}
    </div>
  );
});
```

## Effect Optimization

### Conditional Effects

Only run effects when necessary:

```javascript
const ConditionalEffect = createComponent(({ lens, isEnabled, data }) => {
  const processedData = lens.useRefraction(null);
  
  lens.useEffect(() => {
    // Only process data when enabled and data exists
    if (isEnabled && data) {
      const processed = expensiveProcessing(data);
      processedData.set(processed);
    } else {
      processedData.set(null);
    }
  }, [isEnabled, data]); // Effect only runs when these change
  
  return (
    <div>
      {processedData.value ? (
        <DataDisplay data={processedData.value} />
      ) : (
        <div>No processed data</div>
      )}
    </div>
  );
});
```

### Effect Dependencies

Properly manage effect dependencies to avoid unnecessary runs:

```javascript
const DependencyExample = createComponent(({ lens, config }) => {
  const data = lens.useRefraction(null);
  
  // ✅ Good - Specific dependencies
  lens.useEffect(() => {
    fetchData(config.url, config.params).then(data.set);
  }, [config.url, config.params]);
  
  // ❌ Bad - Entire object as dependency
  // lens.useEffect(() => {
  //   fetchData(config.url, config.params).then(data.set);
  // }, [config]); // This runs whenever ANY config property changes
  
  return <div>{data.value?.title}</div>;
});
```

### Memoized Effects

Use memoization to prevent unnecessary effect runs:

```javascript
const MemoizedEffect = createComponent(({ lens, items }) => {
  const processedItems = lens.useRefraction([]);
  
  // Memoize expensive computation
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
    <div>
      {processedItems.value.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});
```

## Flash Effects

Flash effects run once after the component renders, useful for animations and DOM manipulations:

```javascript
const FlashEffect = createComponent(({ lens }) => {
  const elementRef = lens.useRefraction(null);
  const isVisible = lens.useRefraction(false);
  
  // Flash effect runs after render
  lens.useFlash(() => {
    if (elementRef.value && isVisible.value) {
      // Animate element entrance
      elementRef.value.style.opacity = '0';
      elementRef.value.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        elementRef.value.style.transition = 'all 0.3s ease';
        elementRef.value.style.opacity = '1';
        elementRef.value.style.transform = 'translateY(0)';
      });
    }
  }, [isVisible.value]);
  
  return (
    <div>
      <button onClick={() => isVisible.set(!isVisible.value)}>
        Toggle Element
      </button>
      {isVisible.value && (
        <div ref={(el) => elementRef.set(el)}>
          Animated Element
        </div>
      )}
    </div>
  );
});
```

## Error Handling in Effects

### Try-Catch in Effects

```javascript
const ErrorHandlingEffect = createComponent(({ lens }) => {
  const data = lens.useRefraction(null);
  const error = lens.useRefraction(null);
  
  lens.useEffect(() => {
    const loadData = async () => {
      try {
        error.set(null);
        const result = await riskyAsyncOperation();
        data.set(result);
      } catch (err) {
        console.error('Effect error:', err);
        error.set(err.message);
      }
    };
    
    loadData();
  }, []);
  
  if (error.value) {
    return <div>Error: {error.value}</div>;
  }
  
  return <div>{data.value || 'Loading...'}</div>;
});
```

### Error Boundaries for Effects

```javascript
const withEffectErrorBoundary = (Component) => {
  return createComponent((props) => {
    const { lens } = props;
    const hasError = lens.useRefraction(false);
    const errorMessage = lens.useRefraction('');
    
    // Wrap the original component with error handling
    try {
      if (hasError.value) {
        return (
          <div className="error-boundary">
            <h2>Something went wrong</h2>
            <p>{errorMessage.value}</p>
            <button onClick={() => hasError.set(false)}>
              Try Again
            </button>
          </div>
        );
      }
      
      return <Component {...props} />;
    } catch (error) {
      hasError.set(true);
      errorMessage.set(error.message);
      return null;
    }
  });
};
```

## Testing Effects

### Mocking Effects

```javascript
// Component with effects
const TimerComponent = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  
  lens.useEffect(() => {
    const interval = setInterval(() => {
      count.set(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <div>Count: {count.value}</div>;
});

// Test
import { render, act } from '@refract/testing-utils';

describe('TimerComponent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('increments count every second', () => {
    const { getByText } = render(<TimerComponent />);
    
    expect(getByText('Count: 0')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(getByText('Count: 1')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(getByText('Count: 3')).toBeInTheDocument();
  });
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
  // Handle user data
  fetchUser(userId).then(setUser);
}, [userId]);

lens.useEffect(() => {
  // Handle analytics
  trackPageView(pageName);
}, [pageName]);

// ❌ Bad - Mixed concerns
lens.useEffect(() => {
  fetchUser(userId).then(setUser);
  trackPageView(pageName);
}, [userId, pageName]);
```

## Next Steps

Now that you understand effects, explore:
- **[API Reference](../api/overview)** - Complete API documentation
- **[Tutorials](../tutorials/counter-app)** - Practical examples using effects
- **[Advanced Topics](../advanced/performance)** - Performance optimization techniques
