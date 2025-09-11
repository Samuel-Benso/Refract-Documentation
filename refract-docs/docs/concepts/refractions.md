# Refractions

Refractions are the core reactive primitives in Refract. They represent units of state that automatically notify the UI when their values change. Think of them as reactive variables that eliminate the need for manual state management and re-rendering logic.

## What are Refractions?

A refraction is a reactive container that holds a value and notifies subscribers when that value changes. Unlike traditional state variables, refractions automatically trigger UI updates when modified, making your applications truly reactive.

```javascript
import { useRefraction } from 'refract';

// Create a refraction with initial value
const count = useRefraction(0);

// Read the current value
console.log(count.value); // 0

// Update the value (triggers UI update)
count.set(5);
console.log(count.value); // 5
```

## Creating Refractions

### Basic Refractions

```javascript
import { createComponent } from 'refract';

const BasicExample = createComponent(({ lens }) => {
  // Primitive values
  const name = lens.useRefraction('John');
  const age = lens.useRefraction(25);
  const isActive = lens.useRefraction(true);
  
  // Objects and arrays
  const user = lens.useRefraction({ 
    id: 1, 
    email: 'john@example.com' 
  });
  const items = lens.useRefraction(['apple', 'banana', 'orange']);
  
  return (
    <div>
      <p>Name: {name.value}</p>
      <p>Age: {age.value}</p>
      <p>Status: {isActive.value ? 'Active' : 'Inactive'}</p>
    </div>
  );
});
```

### Global Refractions

Create refractions that can be shared across components:

```javascript
// store/theme.js
import { createRefraction } from 'refract';

export const theme = createRefraction('light');
export const user = createRefraction(null);
export const notifications = createRefraction([]);

// components/ThemeToggle.js
import { createComponent } from 'refract';
import { theme } from '../store/theme';

const ThemeToggle = createComponent(({ lens }) => {
  const toggleTheme = () => {
    theme.set(theme.value === 'light' ? 'dark' : 'light');
  };
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme.value}
    </button>
  );
});
```

## Refraction API

### Reading Values

```javascript
const counter = lens.useRefraction(0);

// Get current value
const currentValue = counter.value;

// Subscribe to changes (automatic in components)
counter.subscribe((newValue) => {
  console.log('Counter changed to:', newValue);
});
```

### Updating Values

```javascript
const state = lens.useRefraction({ count: 0, name: 'Test' });

// Direct assignment
state.set({ count: 1, name: 'Updated' });

// Functional update
state.set(prev => ({ ...prev, count: prev.count + 1 }));

// Update specific property (for objects)
state.update('count', prev => prev + 1);
state.update('name', 'New Name');
```

### Batch Updates

```javascript
const BatchExample = createComponent(({ lens }) => {
  const firstName = lens.useRefraction('');
  const lastName = lens.useRefraction('');
  const email = lens.useRefraction('');
  
  const updateUser = () => {
    // Batch multiple updates to prevent multiple re-renders
    lens.batch(() => {
      firstName.set('John');
      lastName.set('Doe');
      email.set('john.doe@example.com');
    });
  };
  
  return (
    <div>
      <p>{firstName.value} {lastName.value}</p>
      <p>{email.value}</p>
      <button onClick={updateUser}>Update User</button>
    </div>
  );
});
```

## Advanced Patterns

### Derived Refractions

Create refractions that automatically compute values based on other refractions:

```javascript
const ShoppingCart = createComponent(({ lens }) => {
  const items = lens.useRefraction([
    { id: 1, name: 'Apple', price: 1.50, quantity: 2 },
    { id: 2, name: 'Banana', price: 0.75, quantity: 3 }
  ]);
  
  // Derived refraction for total price
  const total = lens.useDerived(() => {
    return items.value.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  }, [items]);
  
  const addItem = (item) => {
    items.set([...items.value, item]);
  };
  
  return (
    <div>
      <h3>Shopping Cart</h3>
      {items.value.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price} x {item.quantity}
        </div>
      ))}
      <h4>Total: ${total.value.toFixed(2)}</h4>
    </div>
  );
});
```

### Async Refractions

Handle asynchronous operations with refractions:

```javascript
const AsyncDataExample = createComponent(({ lens }) => {
  const data = lens.useRefraction(null);
  const loading = lens.useRefraction(false);
  const error = lens.useRefraction(null);
  
  const fetchData = async () => {
    loading.set(true);
    error.set(null);
    
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      data.set(result);
    } catch (err) {
      error.set(err.message);
    } finally {
      loading.set(false);
    }
  };
  
  lens.useEffect(() => {
    fetchData();
  }, []);
  
  if (loading.value) return <div>Loading...</div>;
  if (error.value) return <div>Error: {error.value}</div>;
  
  return (
    <div>
      <pre>{JSON.stringify(data.value, null, 2)}</pre>
      <button onClick={fetchData}>Refresh</button>
    </div>
  );
});
```

### Refraction Validation

Add validation to refractions:

```javascript
const ValidatedForm = createComponent(({ lens }) => {
  const email = lens.useRefraction('');
  const password = lens.useRefraction('');
  
  // Validation refractions
  const emailValid = lens.useDerived(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  }, [email]);
  
  const passwordValid = lens.useDerived(() => {
    return password.value.length >= 8;
  }, [password]);
  
  const formValid = lens.useDerived(() => {
    return emailValid.value && passwordValid.value;
  }, [emailValid, passwordValid]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValid.value) {
      console.log('Form submitted:', { 
        email: email.value, 
        password: password.value 
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email.value}
          onChange={(e) => email.set(e.target.value)}
          placeholder="Email"
          className={emailValid.value ? 'valid' : 'invalid'}
        />
        {!emailValid.value && email.value && (
          <span className="error">Invalid email format</span>
        )}
      </div>
      
      <div>
        <input
          type="password"
          value={password.value}
          onChange={(e) => password.set(e.target.value)}
          placeholder="Password"
          className={passwordValid.value ? 'valid' : 'invalid'}
        />
        {!passwordValid.value && password.value && (
          <span className="error">Password must be at least 8 characters</span>
        )}
      </div>
      
      <button type="submit" disabled={!formValid.value}>
        Submit
      </button>
    </form>
  );
});
```

## Refraction Persistence

### Local Storage Integration

```javascript
const usePersistentRefraction = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  const initial = stored ? JSON.parse(stored) : defaultValue;
  
  const refraction = useRefraction(initial);
  
  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(refraction.value));
  }, [refraction.value, key]);
  
  return refraction;
};

const PersistentCounter = createComponent(({ lens }) => {
  const count = lens.useOptic(() => 
    usePersistentRefraction('counter', 0), []
  );
  
  return (
    <div>
      <p>Persistent Count: {count.value}</p>
      <button onClick={() => count.set(count.value + 1)}>
        Increment
      </button>
    </div>
  );
});
```

### URL Synchronization

```javascript
const useUrlRefraction = (param, defaultValue) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(param) || defaultValue;
  
  const refraction = useRefraction(value);
  
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (refraction.value) {
      newParams.set(param, refraction.value);
    } else {
      newParams.delete(param);
    }
    setSearchParams(newParams);
  }, [refraction.value, param, searchParams, setSearchParams]);
  
  return refraction;
};
```

## Performance Considerations

### Avoiding Unnecessary Updates

```javascript
// ✅ Good - Specific updates
const updateSpecificField = () => {
  user.update('name', 'New Name');
};

// ❌ Bad - Full object replacement for small changes
const updateBadly = () => {
  user.set({ ...user.value, name: 'New Name' });
};
```

### Debouncing Updates

```javascript
const SearchInput = createComponent(({ lens }) => {
  const query = lens.useRefraction('');
  const debouncedQuery = lens.useRefraction('');
  
  // Debounce the search query
  lens.useEffect(() => {
    const timer = setTimeout(() => {
      debouncedQuery.set(query.value);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query.value]);
  
  // Perform search when debounced query changes
  lens.useEffect(() => {
    if (debouncedQuery.value) {
      performSearch(debouncedQuery.value);
    }
  }, [debouncedQuery.value]);
  
  return (
    <input
      value={query.value}
      onChange={(e) => query.set(e.target.value)}
      placeholder="Search..."
    />
  );
});
```

## Best Practices

### 1. Initialize with Appropriate Types
```javascript
// ✅ Good
const items = lens.useRefraction([]);
const user = lens.useRefraction(null);
const count = lens.useRefraction(0);

// ❌ Bad
const items = lens.useRefraction(); // undefined
const user = lens.useRefraction({}); // Empty object when null expected
```

### 2. Use Descriptive Names
```javascript
// ✅ Good
const isLoading = lens.useRefraction(false);
const userProfile = lens.useRefraction(null);
const shoppingCartItems = lens.useRefraction([]);

// ❌ Bad
const flag = lens.useRefraction(false);
const data = lens.useRefraction(null);
const items = lens.useRefraction([]);
```

### 3. Keep Refractions Focused
```javascript
// ✅ Good - Separate concerns
const firstName = lens.useRefraction('');
const lastName = lens.useRefraction('');
const email = lens.useRefraction('');

// ❌ Bad - Monolithic state
const formData = lens.useRefraction({
  firstName: '',
  lastName: '',
  email: '',
  preferences: {},
  settings: {},
  // ... too much in one refraction
});
```

### 4. Handle Edge Cases
```javascript
const SafeRefraction = createComponent(({ lens }) => {
  const data = lens.useRefraction(null);
  
  const updateData = (newData) => {
    // Validate before setting
    if (newData && typeof newData === 'object') {
      data.set(newData);
    }
  };
  
  return (
    <div>
      {data.value ? (
        <div>{data.value.name}</div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
});
```

## Debugging Refractions

### Development Tools

```javascript
// Enable refraction debugging in development
if (process.env.NODE_ENV === 'development') {
  const debugRefraction = (name, refraction) => {
    refraction.subscribe((value) => {
      console.log(`[${name}] changed to:`, value);
    });
  };
  
  debugRefraction('user', user);
  debugRefraction('theme', theme);
}
```

### Refraction Inspector

```javascript
const RefractionInspector = createComponent(({ lens, refraction, name }) => {
  const history = lens.useRefraction([]);
  
  lens.useEffect(() => {
    const unsubscribe = refraction.subscribe((value) => {
      history.set(prev => [...prev, {
        timestamp: Date.now(),
        value: JSON.stringify(value)
      }]);
    });
    
    return unsubscribe;
  }, [refraction]);
  
  return (
    <div className="refraction-inspector">
      <h4>{name} History</h4>
      <div>Current: {JSON.stringify(refraction.value)}</div>
      <ul>
        {history.value.map((entry, index) => (
          <li key={index}>
            {new Date(entry.timestamp).toLocaleTimeString()}: {entry.value}
          </li>
        ))}
      </ul>
    </div>
  );
});
```

## Next Steps

Now that you understand refractions, explore:
- **[Lenses](./lenses)** - Scoped access to reactive features
- **[Optics](./optics)** - Reusable logic with refractions
- **[Effects](./effects)** - Side effects and lifecycle management
