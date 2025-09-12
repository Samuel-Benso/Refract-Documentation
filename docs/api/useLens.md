# useLens

The `useLens` hook provides access to the lens system within Refract components. The lens is the primary interface for accessing reactive features like state management, effects, and optics in a component-scoped manner.

## Syntax

```javascript
const lens = useLens()
```

## Parameters

None. The `useLens` hook takes no parameters.

## Return Value

Returns a `Lens` object with the following interface:

```typescript
interface Lens {
  useRefraction<T>(initialValue: T): Refraction<T>;
  useDerived<T>(compute: () => T, deps: any[]): Refraction<T>;
  useEffect(effect: () => void | (() => void), deps?: any[]): void;
  useFlash(effect: () => void, deps?: any[]): void;
  useOptic<T>(optic: () => T, deps: any[]): T;
  batch(fn: () => void): void;
}
```

## Batching Updates {#batching}

Batching allows you to group multiple state updates into a single re-render, which can significantly improve performance when making multiple related state changes.

### `lens.batch(callback)`

Groups multiple state updates into a single re-render.

#### Parameters
- `callback`: A function that contains the state updates to be batched.

#### Returns
- `void`

#### Example

```javascript
const Counter = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  const multiplier = lens.useRefraction(1);

  const incrementWithBatching = () => {
    // Without batching, this would cause two re-renders
    lens.batch(() => {
      count.value += 1;
      multiplier.value = count.value * 2;
    });
    // Only one re-render happens here
  };

  return (
    <div>
      <p>Count: {count.value}</p>
      <p>Multiplier: {multiplier.value}</p>
      <button onClick={incrementWithBatching}>
        Increment with Batching
      </button>
    </div>
  );
});
```

### When to Use Batching

- **Multiple State Updates**: When you need to update multiple state values that are related
- **Performance Optimization**: To minimize re-renders in performance-critical paths
- **Complex State Transitions**: When state updates depend on each other

### Best Practices

1. **Group Related Updates**: Only batch updates that are logically related
2. **Avoid Side Effects**: Keep the batch callback pure and free of side effects
3. **Nesting**: Batching is automatically handled in nested batch calls
4. **Async Operations**: Batching doesn't work with asynchronous code - each `await` is a potential render point

## Basic Usage

### Accessing the Lens

```javascript
import { createComponent, useLens } from 'refract';

const MyComponent = createComponent((props) => {
  const lens = useLens();
  
  // Now you can use all lens methods
  const state = lens.useRefraction(0);
  
  lens.useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  return <div>Count: {state.value}</div>;
});
```

### Alternative: Destructured Props

```javascript
// Most common pattern - lens is provided as prop
const MyComponent = createComponent(({ lens, ...otherProps }) => {
  const state = lens.useRefraction(0);
  
  return <div>Count: {state.value}</div>;
});
```

## Lens Methods

### State Management

```javascript
const StateExample = createComponent(({ lens }) => {
  // Create reactive state
  const count = lens.useRefraction(0);
  const user = lens.useRefraction(null);
  
  // Create derived state
  const doubled = lens.useDerived(() => count.value * 2, [count]);
  
  return (
    <div>
      <p>Count: {count.value}</p>
      <p>Doubled: {doubled.value}</p>
      <button onClick={() => count.set(count.value + 1)}>
        Increment
      </button>
    </div>
  );
});
```

### Effect Management

```javascript
const EffectExample = createComponent(({ lens, userId }) => {
  const user = lens.useRefraction(null);
  
  // Side effects
  lens.useEffect(() => {
    fetchUser(userId).then(user.set);
  }, [userId]);
  
  // Post-render effects
  lens.useFlash(() => {
    if (user.value) {
      document.title = `User: ${user.value.name}`;
    }
  }, [user.value]);
  
  return <div>{user.value?.name || 'Loading...'}</div>;
});
```

### Optic Usage

```javascript
const OpticExample = createComponent(({ lens }) => {
  // Use custom optics
  const form = lens.useOptic(() => useForm({
    name: '',
    email: ''
  }), []);
  
  const api = lens.useOptic(() => useApiClient(), []);
  
  return (
    <form>
      <input
        value={form.values.name}
        onChange={(e) => form.setValue('name', e.target.value)}
      />
      <input
        value={form.values.email}
        onChange={(e) => form.setValue('email', e.target.value)}
      />
    </form>
  );
});
```

## Batching Updates

### Performance Optimization

```javascript
const BatchingExample = createComponent(({ lens }) => {
  const firstName = lens.useRefraction('');
  const lastName = lens.useRefraction('');
  const email = lens.useRefraction('');
  const phone = lens.useRefraction('');
  
  const updateAllFields = () => {
    // Batch multiple updates to prevent multiple re-renders
    lens.batch(() => {
      firstName.set('John');
      lastName.set('Doe');
      email.set('john.doe@example.com');
      phone.set('555-1234');
    });
  };
  
  const updateIndividually = () => {
    // This would cause 4 separate re-renders
    firstName.set('Jane');
    lastName.set('Smith');
    email.set('jane.smith@example.com');
    phone.set('555-5678');
  };
  
  return (
    <div>
      <p>Name: {firstName.value} {lastName.value}</p>
      <p>Email: {email.value}</p>
      <p>Phone: {phone.value}</p>
      
      <button onClick={updateAllFields}>
        Update All (Batched)
      </button>
      <button onClick={updateIndividually}>
        Update All (Individual)
      </button>
    </div>
  );
});
```

### Complex Batching

```javascript
const ComplexBatching = createComponent(({ lens }) => {
  const items = lens.useRefraction([]);
  const selectedItems = lens.useRefraction(new Set());
  const totalPrice = lens.useRefraction(0);
  const discount = lens.useRefraction(0);
  
  const addItemsWithCalculation = (newItems) => {
    lens.batch(() => {
      // Add items
      items.set(prev => [...prev, ...newItems]);
      
      // Update selections
      const newSelections = new Set(selectedItems.value);
      newItems.forEach(item => newSelections.add(item.id));
      selectedItems.set(newSelections);
      
      // Recalculate totals
      const total = newItems.reduce((sum, item) => sum + item.price, totalPrice.value);
      totalPrice.set(total);
      
      // Apply discount if total is high
      if (total > 100) {
        discount.set(10);
      }
    });
  };
  
  return (
    <div>
      <p>Items: {items.value.length}</p>
      <p>Selected: {selectedItems.value.size}</p>
      <p>Total: ${totalPrice.value}</p>
      <p>Discount: {discount.value}%</p>
      
      <button onClick={() => addItemsWithCalculation([
        { id: 1, name: 'Item 1', price: 50 },
        { id: 2, name: 'Item 2', price: 75 }
      ])}>
        Add Items with Calculation
      </button>
    </div>
  );
});
```

## Lens Composition Patterns

### Custom Lens Wrapper

```javascript
const createEnhancedLens = (baseLens, context) => {
  return {
    ...baseLens,
    
    // Enhanced useRefraction with validation
    useValidatedRefraction: (initialValue, validator) => {
      const refraction = baseLens.useRefraction(initialValue);
      
      return {
        ...refraction,
        set: (value) => {
          if (validator && !validator(value)) {
            console.warn('Invalid value:', value);
            return;
          }
          refraction.set(value);
        }
      };
    },
    
    // Context-aware effects
    useContextualEffect: (effect, deps) => {
      baseLens.useEffect(() => {
        return effect(context);
      }, [context, ...deps]);
    }
  };
};

const EnhancedComponent = createComponent(({ lens, context }) => {
  const enhancedLens = createEnhancedLens(lens, context);
  
  const validatedCount = enhancedLens.useValidatedRefraction(
    0, 
    (value) => value >= 0 && value <= 100
  );
  
  return (
    <div>
      <p>Count: {validatedCount.value}</p>
      <button onClick={() => validatedCount.set(validatedCount.value + 1)}>
        Increment
      </button>
    </div>
  );
});
```

### Lens Provider Pattern

```javascript
const LensProvider = createComponent(({ lens, children, enhancements }) => {
  const enhancedLens = {
    ...lens,
    ...enhancements,
    
    // Add debugging capabilities
    useDebugRefraction: (initialValue, name) => {
      const refraction = lens.useRefraction(initialValue);
      
      lens.useEffect(() => {
        console.log(`[${name}] changed to:`, refraction.value);
      }, [refraction.value]);
      
      return refraction;
    }
  };
  
  return children(enhancedLens);
});

const ConsumerComponent = createComponent(({ lens }) => {
  return (
    <LensProvider enhancements={{ customMethod: () => 'custom' }}>
      {(enhancedLens) => {
        const debugCount = enhancedLens.useDebugRefraction(0, 'counter');
        
        return (
          <div>
            <p>Count: {debugCount.value}</p>
            <button onClick={() => debugCount.set(debugCount.value + 1)}>
              Increment (with debug)
            </button>
          </div>
        );
      }}
    </LensProvider>
  );
});
```

## Advanced Usage

### Conditional Lens Operations

```javascript
const ConditionalLens = createComponent(({ lens, mode }) => {
  const data = lens.useRefraction(null);
  
  // Conditional effects based on mode
  if (mode === 'live') {
    lens.useEffect(() => {
      const interval = setInterval(() => {
        fetchLiveData().then(data.set);
      }, 1000);
      
      return () => clearInterval(interval);
    }, []);
  } else if (mode === 'static') {
    lens.useEffect(() => {
      fetchStaticData().then(data.set);
    }, []);
  }
  
  return <div>{data.value || 'Loading...'}</div>;
});
```

### Lens Middleware

```javascript
const withLensMiddleware = (Component, middleware) => {
  return createComponent((props) => {
    const { lens, ...otherProps } = props;
    
    const wrappedLens = middleware.reduce((currentLens, middlewareFn) => {
      return middlewareFn(currentLens);
    }, lens);
    
    return <Component lens={wrappedLens} {...otherProps} />;
  });
};

// Logging middleware
const loggingMiddleware = (lens) => ({
  ...lens,
  useRefraction: (initialValue) => {
    const refraction = lens.useRefraction(initialValue);
    console.log('Created refraction with initial value:', initialValue);
    return refraction;
  }
});

// Performance middleware
const performanceMiddleware = (lens) => ({
  ...lens,
  batch: (fn) => {
    const start = performance.now();
    lens.batch(fn);
    const end = performance.now();
    console.log(`Batch operation took ${end - start}ms`);
  }
});

const EnhancedComponent = withLensMiddleware(
  MyComponent,
  [loggingMiddleware, performanceMiddleware]
);
```

## Testing with Lenses

### Mock Lens for Testing

```javascript
// test-utils.js
export const createMockLens = () => {
  const refractions = new Map();
  const effects = [];
  
  return {
    useRefraction: jest.fn((initialValue) => {
      const id = Symbol();
      const refraction = {
        value: initialValue,
        set: jest.fn((newValue) => {
          refraction.value = typeof newValue === 'function' 
            ? newValue(refraction.value) 
            : newValue;
        })
      };
      refractions.set(id, refraction);
      return refraction;
    }),
    
    useEffect: jest.fn((effect, deps) => {
      effects.push({ effect, deps });
    }),
    
    useFlash: jest.fn(),
    useOptic: jest.fn(),
    useDerived: jest.fn(),
    batch: jest.fn((fn) => fn()),
    
    // Test helpers
    getRefractions: () => Array.from(refractions.values()),
    getEffects: () => effects
  };
};

// Component.test.js
import { createMockLens } from './test-utils';

test('component uses lens correctly', () => {
  const mockLens = createMockLens();
  
  const TestComponent = createComponent(({ lens }) => {
    const count = lens.useRefraction(0);
    
    lens.useEffect(() => {
      console.log('Effect ran');
    }, []);
    
    return {
      count,
      increment: () => count.set(count.value + 1)
    };
  });
  
  const component = TestComponent({ lens: mockLens });
  
  expect(mockLens.useRefraction).toHaveBeenCalledWith(0);
  expect(mockLens.useEffect).toHaveBeenCalled();
  
  component.increment();
  expect(component.count.set).toHaveBeenCalledWith(1);
});
```

### Integration Testing

```javascript
import { render, act } from '@refract/testing-utils';

test('lens integration works correctly', () => {
  const TestComponent = createComponent(({ lens }) => {
    const count = lens.useRefraction(0);
    
    lens.useEffect(() => {
      // Simulate async operation
      setTimeout(() => {
        count.set(10);
      }, 100);
    }, []);
    
    return (
      <div>
        <span data-testid="count">{count.value}</span>
        <button onClick={() => count.set(count.value + 1)}>
          Increment
        </button>
      </div>
    );
  });
  
  const { getByTestId, getByRole } = render(<TestComponent />);
  
  expect(getByTestId('count')).toHaveTextContent('0');
  
  act(() => {
    fireEvent.click(getByRole('button'));
  });
  
  expect(getByTestId('count')).toHaveTextContent('1');
});
```

## Best Practices

### 1. Use Lens as Component Prop
```javascript
// ✅ Good - Standard pattern
const MyComponent = createComponent(({ lens, ...props }) => {
  const state = lens.useRefraction(0);
  return <div>{state.value}</div>;
});

// ❌ Bad - Calling useLens unnecessarily
const MyComponent = createComponent((props) => {
  const lens = useLens(); // Unnecessary when lens is provided as prop
  const state = lens.useRefraction(0);
  return <div>{state.value}</div>;
});
```

### 2. Batch Related Updates
```javascript
// ✅ Good - Batch related state changes
const updateUserProfile = () => {
  lens.batch(() => {
    firstName.set('John');
    lastName.set('Doe');
    email.set('john.doe@example.com');
  });
};

// ❌ Bad - Individual updates cause multiple re-renders
const updateUserProfile = () => {
  firstName.set('John');
  lastName.set('Doe');
  email.set('john.doe@example.com');
};
```

### 3. Use Appropriate Lens Methods
```javascript
// ✅ Good - Use the right method for the job
lens.useEffect(() => {
  // Side effects with cleanup
  const subscription = api.subscribe(handleData);
  return () => subscription.unsubscribe();
}, []);

lens.useFlash(() => {
  // DOM manipulation after render
  elementRef.current?.focus();
}, [shouldFocus]);

// ❌ Bad - Using wrong method
lens.useFlash(() => {
  // Side effects should use useEffect, not useFlash
  const subscription = api.subscribe(handleData);
}, []);
```

### 4. Keep Lens Operations Focused
```javascript
// ✅ Good - Focused, single-purpose operations
const UserProfile = createComponent(({ lens, userId }) => {
  const user = lens.useRefraction(null);
  const loading = lens.useRefraction(false);
  
  lens.useEffect(() => {
    loading.set(true);
    fetchUser(userId).then(user.set).finally(() => loading.set(false));
  }, [userId]);
  
  return <div>{loading.value ? 'Loading...' : user.value?.name}</div>;
});

// ❌ Bad - Mixed concerns in single operations
const UserProfile = createComponent(({ lens, userId }) => {
  const everything = lens.useRefraction({
    user: null,
    loading: false,
    posts: [],
    settings: {},
    // ... too much in one state
  });
});
```

## Related APIs

- **[createComponent](./createComponent)** - Components that receive lens
- **[useRefraction](./useRefraction)** - State management through lens
- **[useEffect](./useEffect)** - Side effects through lens
- **[useOptic](./useOptic)** - Reusable logic through lens
- **[useFlash](./useFlash)** - Post-render effects through lens
