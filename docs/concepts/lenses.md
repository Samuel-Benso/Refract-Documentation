# Lenses

Lenses are Refract's scoped interface to reactive features within components. They provide a clean, organized way to access refractions, effects, and optics while maintaining proper component boundaries and lifecycle management.

## What are Lenses?

A lens is a component-scoped object that provides access to Refract's reactive system. Every component created with `createComponent()` receives a lens as its first parameter, giving you access to:

- **Refractions** - Reactive state management
- **Effects** - Side effect handling and lifecycle
- **Optics** - Reusable logic patterns
- **Batching** - Performance optimization

```javascript
import { createComponent } from 'refract';

const MyComponent = createComponent(({ lens, ...props }) => {
  // lens provides scoped access to reactive features
  const state = lens.useRefraction(0);
  
  lens.useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  return <div>Count: {state.value}</div>;
});
```

## Lens API Overview

### Core Methods

```javascript
const ExampleComponent = createComponent(({ lens }) => {
  // State management
  const count = lens.useRefraction(0);
  const user = lens.useRefraction(null);
  
  // Derived state
  const doubled = lens.useDerived(() => count.value * 2, [count]);
  
  // Side effects
  lens.useEffect(() => {
    // Effect logic
  }, []);
  
  // Reusable logic
  const customLogic = lens.useOptic(() => {
    // Custom optic logic
  }, []);
  
  // Performance optimization
  lens.batch(() => {
    count.set(5);
    user.set({ name: 'John' });
  });
  
  return <div>Component content</div>;
});
```

## Scoped State Management

### Local Component State

```javascript
const UserProfile = createComponent(({ lens, userId }) => {
  // Each component instance has its own scoped state
  const profile = lens.useRefraction(null);
  const loading = lens.useRefraction(true);
  const error = lens.useRefraction(null);
  
  const fetchProfile = async () => {
    loading.set(true);
    error.set(null);
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      profile.set(data);
    } catch (err) {
      error.set(err.message);
    } finally {
      loading.set(false);
    }
  };
  
  lens.useEffect(() => {
    fetchProfile();
  }, [userId]);
  
  if (loading.value) return <div>Loading profile...</div>;
  if (error.value) return <div>Error: {error.value}</div>;
  
  return (
    <div className="user-profile">
      <h2>{profile.value?.name}</h2>
      <p>{profile.value?.email}</p>
      <button onClick={fetchProfile}>Refresh</button>
    </div>
  );
});
```

### State Isolation

```javascript
const CounterList = createComponent(({ lens }) => {
  const counters = lens.useRefraction([
    { id: 1, name: 'Counter A' },
    { id: 2, name: 'Counter B' },
    { id: 3, name: 'Counter C' }
  ]);
  
  return (
    <div>
      <h2>Multiple Counters</h2>
      {counters.value.map(counter => (
        <Counter key={counter.id} name={counter.name} />
      ))}
    </div>
  );
});

const Counter = createComponent(({ lens, name }) => {
  // Each Counter has its own isolated state
  const count = lens.useRefraction(0);
  
  return (
    <div className="counter">
      <h3>{name}</h3>
      <p>Count: {count.value}</p>
      <button onClick={() => count.set(count.value + 1)}>
        Increment
      </button>
    </div>
  );
});
```

## Effect Management

### Component Lifecycle

```javascript
const LifecycleExample = createComponent(({ lens, data }) => {
  const processedData = lens.useRefraction(null);
  
  // Mount effect
  lens.useEffect(() => {
    console.log('Component mounted');
    
    // Cleanup on unmount
    return () => {
      console.log('Component unmounting');
    };
  }, []);
  
  // Update effect
  lens.useEffect(() => {
    console.log('Data changed:', data);
    
    // Process data when it changes
    const processed = processData(data);
    processedData.set(processed);
  }, [data]);
  
  return (
    <div>
      {processedData.value ? (
        <DataDisplay data={processedData.value} />
      ) : (
        <div>Processing data...</div>
      )}
    </div>
  );
});
```

### Event Listeners and Subscriptions

```javascript
const WindowSizeTracker = createComponent(({ lens }) => {
  const windowSize = lens.useRefraction({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  lens.useEffect(() => {
    const handleResize = () => {
      windowSize.set({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div>
      <p>Window size: {windowSize.value.width} x {windowSize.value.height}</p>
    </div>
  );
});
```

## Optic Integration

### Custom Hooks with Lenses

```javascript
// Custom optic for form handling
const useForm = (initialValues) => {
  const values = useRefraction(initialValues);
  const errors = useRefraction({});
  const touched = useRefraction({});
  
  const setValue = (field, value) => {
    values.update(field, value);
    
    // Clear error when user starts typing
    if (errors.value[field]) {
      errors.update(field, null);
    }
  };
  
  const setError = (field, error) => {
    errors.update(field, error);
  };
  
  const setTouched = (field) => {
    touched.update(field, true);
  };
  
  const validate = (validationRules) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = values.value[field];
      
      if (rule.required && !value) {
        newErrors[field] = `${field} is required`;
      } else if (rule.minLength && value.length < rule.minLength) {
        newErrors[field] = `${field} must be at least ${rule.minLength} characters`;
      }
    });
    
    errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return {
    values: values.value,
    errors: errors.value,
    touched: touched.value,
    setValue,
    setError,
    setTouched,
    validate
  };
};

// Using the custom optic
const ContactForm = createComponent(({ lens }) => {
  const form = lens.useOptic(() => useForm({
    name: '',
    email: '',
    message: ''
  }), []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isValid = form.validate({
      name: { required: true, minLength: 2 },
      email: { required: true },
      message: { required: true, minLength: 10 }
    });
    
    if (isValid) {
      console.log('Form submitted:', form.values);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={form.values.name}
          onChange={(e) => form.setValue('name', e.target.value)}
          onBlur={() => form.setTouched('name')}
          placeholder="Name"
        />
        {form.touched.name && form.errors.name && (
          <span className="error">{form.errors.name}</span>
        )}
      </div>
      
      <div>
        <input
          type="email"
          value={form.values.email}
          onChange={(e) => form.setValue('email', e.target.value)}
          onBlur={() => form.setTouched('email')}
          placeholder="Email"
        />
        {form.touched.email && form.errors.email && (
          <span className="error">{form.errors.email}</span>
        )}
      </div>
      
      <div>
        <textarea
          value={form.values.message}
          onChange={(e) => form.setValue('message', e.target.value)}
          onBlur={() => form.setTouched('message')}
          placeholder="Message"
        />
        {form.touched.message && form.errors.message && (
          <span className="error">{form.errors.message}</span>
        )}
      </div>
      
      <button type="submit">Send Message</button>
    </form>
  );
});
```

## Performance Optimization

### Batching Updates

```javascript
const BatchingExample = createComponent(({ lens }) => {
  const firstName = lens.useRefraction('');
  const lastName = lens.useRefraction('');
  const email = lens.useRefraction('');
  const phone = lens.useRefraction('');
  
  const updateAllFields = () => {
    // Without batching: 4 separate re-renders
    // firstName.set('John');
    // lastName.set('Doe');
    // email.set('john.doe@example.com');
    // phone.set('555-1234');
    
    // With batching: 1 re-render for all updates
    lens.batch(() => {
      firstName.set('John');
      lastName.set('Doe');
      email.set('john.doe@example.com');
      phone.set('555-1234');
    });
  };
  
  return (
    <div>
      <p>Name: {firstName.value} {lastName.value}</p>
      <p>Email: {email.value}</p>
      <p>Phone: {phone.value}</p>
      <button onClick={updateAllFields}>
        Update All Fields
      </button>
    </div>
  );
});
```

### Conditional Effects

```javascript
const ConditionalEffects = createComponent(({ lens, isActive }) => {
  const data = lens.useRefraction(null);
  
  // Effect only runs when component is active
  lens.useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      fetchLatestData().then(data.set);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <div>
      {isActive ? (
        <div>Active: {data.value || 'Loading...'}</div>
      ) : (
        <div>Inactive</div>
      )}
    </div>
  );
});
```

## Advanced Patterns

### Lens Composition

```javascript
const useLensComposition = (lens) => {
  // Create sub-lenses for different concerns
  const stateLens = {
    useRefraction: lens.useRefraction,
    useDerived: lens.useDerived,
    batch: lens.batch
  };
  
  const effectLens = {
    useEffect: lens.useEffect,
    useOptic: lens.useOptic
  };
  
  return { stateLens, effectLens };
};

const ComposedComponent = createComponent(({ lens }) => {
  const { stateLens, effectLens } = useLensComposition(lens);
  
  const count = stateLens.useRefraction(0);
  
  effectLens.useEffect(() => {
    console.log('Count changed:', count.value);
  }, [count.value]);
  
  return <div>Count: {count.value}</div>;
});
```

### Lens Providers

```javascript
const LensProvider = createComponent(({ lens, children, context }) => {
  // Enhance lens with additional context
  const enhancedLens = {
    ...lens,
    context,
    useContextualRefraction: (key, defaultValue) => {
      return lens.useRefraction(context[key] || defaultValue);
    }
  };
  
  return children(enhancedLens);
});

const ContextualComponent = createComponent(({ lens }) => {
  return (
    <LensProvider context={{ theme: 'dark', user: { id: 1 } }}>
      {(enhancedLens) => {
        const theme = enhancedLens.useContextualRefraction('theme', 'light');
        
        return (
          <div className={`theme-${theme.value}`}>
            Themed content
          </div>
        );
      }}
    </LensProvider>
  );
});
```

## Testing with Lenses

### Mock Lenses for Testing

```javascript
// test-utils.js
export const createMockLens = () => {
  const refractions = new Map();
  
  return {
    useRefraction: (initialValue) => {
      const id = Symbol();
      const refraction = {
        value: initialValue,
        set: (newValue) => {
          refraction.value = typeof newValue === 'function' 
            ? newValue(refraction.value) 
            : newValue;
        }
      };
      refractions.set(id, refraction);
      return refraction;
    },
    
    useEffect: jest.fn(),
    useOptic: jest.fn(),
    batch: (fn) => fn(),
    
    // Test helpers
    getRefractions: () => Array.from(refractions.values())
  };
};

// Component.test.js
import { createMockLens } from './test-utils';

test('Counter component increments correctly', () => {
  const mockLens = createMockLens();
  
  const Counter = createComponent(({ lens }) => {
    const count = lens.useRefraction(0);
    
    return {
      count,
      increment: () => count.set(count.value + 1)
    };
  });
  
  const component = Counter({ lens: mockLens });
  
  expect(component.count.value).toBe(0);
  
  component.increment();
  expect(component.count.value).toBe(1);
});
```

## Best Practices

### 1. Use Descriptive Lens Operations
```javascript
// ✅ Good
const UserDashboard = createComponent(({ lens, userId }) => {
  const userProfile = lens.useRefraction(null);
  const userPosts = lens.useRefraction([]);
  
  lens.useEffect(() => {
    loadUserProfile(userId).then(userProfile.set);
  }, [userId]);
});

// ❌ Bad
const UserDashboard = createComponent(({ lens, userId }) => {
  const data1 = lens.useRefraction(null);
  const data2 = lens.useRefraction([]);
});
```

### 2. Organize Effects Logically
```javascript
// ✅ Good - Group related effects
const DataComponent = createComponent(({ lens }) => {
  const data = lens.useRefraction(null);
  
  // Data fetching effect
  lens.useEffect(() => {
    fetchData().then(data.set);
  }, []);
  
  // Data validation effect
  lens.useEffect(() => {
    if (data.value) {
      validateData(data.value);
    }
  }, [data.value]);
});
```

### 3. Handle Cleanup Properly
```javascript
// ✅ Good - Always cleanup subscriptions
const SubscriptionComponent = createComponent(({ lens }) => {
  const messages = lens.useRefraction([]);
  
  lens.useEffect(() => {
    const subscription = messageService.subscribe((message) => {
      messages.set(prev => [...prev, message]);
    });
    
    // Always return cleanup function
    return () => subscription.unsubscribe();
  }, []);
});
```

### 4. Use Batch for Multiple Updates
```javascript
// ✅ Good - Batch related updates
const FormComponent = createComponent(({ lens }) => {
  const form = lens.useRefraction({ name: '', email: '' });
  const errors = lens.useRefraction({});
  
  const resetForm = () => {
    lens.batch(() => {
      form.set({ name: '', email: '' });
      errors.set({});
    });
  };
});
```

## Debugging Lenses

### Lens Inspector

```javascript
const LensInspector = createComponent(({ lens, name }) => {
  const operations = lens.useRefraction([]);
  
  // Wrap lens methods to track operations
  const trackedLens = {
    ...lens,
    useRefraction: (...args) => {
      operations.set(prev => [...prev, {
        type: 'useRefraction',
        args,
        timestamp: Date.now()
      }]);
      return lens.useRefraction(...args);
    },
    useEffect: (...args) => {
      operations.set(prev => [...prev, {
        type: 'useEffect',
        timestamp: Date.now()
      }]);
      return lens.useEffect(...args);
    }
  };
  
  return (
    <div className="lens-inspector">
      <h4>Lens Operations for {name}</h4>
      <ul>
        {operations.value.map((op, index) => (
          <li key={index}>
            {op.type} at {new Date(op.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
});
```

## Next Steps

Now that you understand lenses, explore:
- **[Optics](./optics)** - Reusable logic patterns
- **[Effects](./effects)** - Advanced side effect management
- **[API Reference](../api/overview)** - Complete API documentation
