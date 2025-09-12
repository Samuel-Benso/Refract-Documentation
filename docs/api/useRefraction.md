# useRefraction

The `useRefraction` hook creates reactive state variables that automatically trigger UI updates when their values change. It's the primary way to manage state in Refract components, providing a simple yet powerful interface for reactive programming.

## Syntax

```javascript
const refraction = lens.useRefraction(initialValue)
```

## Parameters

### `initialValue`
- **Type:** `T`
- **Required:** Yes
- **Description:** The initial value for the reactive state

## Return Value

Returns a `Refraction<T>` object with the following interface:

```typescript
interface Refraction<T> {
  value: T;                                    // Current value
  set: (value: T | ((prev: T) => T)) => void; // Update function
  subscribe: (callback: (value: T) => void) => () => void; // Subscribe to changes
  update: (key: keyof T, value: any) => void; // Update object property (if T is object)
}
```

## Basic Usage

### Primitive Values

```javascript
const Counter = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  const name = lens.useRefraction('');
  const isVisible = lens.useRefraction(true);
  
  return (
    <div>
      <p>Count: {count.value}</p>
      <p>Name: {name.value}</p>
      <p>Visible: {isVisible.value ? 'Yes' : 'No'}</p>
      
      <button onClick={() => count.set(count.value + 1)}>
        Increment
      </button>
      <input 
        value={name.value}
        onChange={(e) => name.set(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={() => isVisible.set(!isVisible.value)}>
        Toggle Visibility
      </button>
    </div>
  );
});
```

### Objects and Arrays

```javascript
const UserForm = createComponent(({ lens }) => {
  const user = lens.useRefraction({
    name: '',
    email: '',
    age: 0
  });
  
  const hobbies = lens.useRefraction(['reading', 'coding']);
  
  const updateUser = (field, value) => {
    user.set(prev => ({ ...prev, [field]: value }));
  };
  
  const addHobby = (hobby) => {
    hobbies.set(prev => [...prev, hobby]);
  };
  
  return (
    <form>
      <input
        value={user.value.name}
        onChange={(e) => updateUser('name', e.target.value)}
        placeholder="Name"
      />
      <input
        value={user.value.email}
        onChange={(e) => updateUser('email', e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={user.value.age}
        onChange={(e) => updateUser('age', parseInt(e.target.value))}
        placeholder="Age"
      />
      
      <div>
        <h3>Hobbies:</h3>
        {hobbies.value.map((hobby, index) => (
          <span key={index}>{hobby}, </span>
        ))}
        <button type="button" onClick={() => addHobby('swimming')}>
          Add Swimming
        </button>
      </div>
    </form>
  );
});
```

## Update Methods

### Direct Assignment

```javascript
const Example = createComponent(({ lens }) => {
  const message = lens.useRefraction('Hello');
  
  // Direct value assignment
  const updateMessage = () => {
    message.set('Updated message');
  };
  
  return (
    <div>
      <p>{message.value}</p>
      <button onClick={updateMessage}>Update</button>
    </div>
  );
});
```

### Functional Updates

```javascript
const FunctionalUpdate = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  const items = lens.useRefraction([]);
  
  // Functional update based on previous value
  const increment = () => {
    count.set(prev => prev + 1);
  };
  
  const addItem = (item) => {
    items.set(prev => [...prev, item]);
  };
  
  const removeItem = (index) => {
    items.set(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div>
      <p>Count: {count.value}</p>
      <button onClick={increment}>Increment</button>
      
      <ul>
        {items.value.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => removeItem(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addItem(`Item ${items.value.length + 1}`)}>
        Add Item
      </button>
    </div>
  );
});
```

### Object Property Updates

```javascript
const ObjectUpdate = createComponent(({ lens }) => {
  const settings = lens.useRefraction({
    theme: 'light',
    notifications: true,
    language: 'en'
  });
  
  // Update specific property (if available)
  const toggleTheme = () => {
    settings.update('theme', settings.value.theme === 'light' ? 'dark' : 'light');
  };
  
  // Alternative: full object update
  const toggleNotifications = () => {
    settings.set(prev => ({
      ...prev,
      notifications: !prev.notifications
    }));
  };
  
  return (
    <div>
      <p>Theme: {settings.value.theme}</p>
      <p>Notifications: {settings.value.notifications ? 'On' : 'Off'}</p>
      
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={toggleNotifications}>Toggle Notifications</button>
    </div>
  );
});
```

## Global Refractions

### Creating Global State

```javascript
// store/globalState.js
import { createRefraction } from 'refract';

export const theme = createRefraction('light');
export const user = createRefraction(null);
export const notifications = createRefraction([]);

// components/ThemeToggle.js
import { createComponent } from 'refract';
import { theme } from '../store/globalState';

const ThemeToggle = createComponent(({ lens }) => {
  // Access global refraction directly
  const toggleTheme = () => {
    theme.set(theme.value === 'light' ? 'dark' : 'light');
  };
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme.value}
    </button>
  );
});

// components/App.js
const App = createComponent(({ lens }) => {
  // Subscribe to global theme changes
  const currentTheme = lens.useRefraction(theme.value);
  
  lens.useEffect(() => {
    const unsubscribe = theme.subscribe((newTheme) => {
      currentTheme.set(newTheme);
    });
    
    return unsubscribe;
  }, []);
  
  return (
    <div className={`app theme-${currentTheme.value}`}>
      <ThemeToggle />
    </div>
  );
});
```

### Global State Management

```javascript
// store/userStore.js
import { createRefraction } from 'refract';

export const userStore = {
  user: createRefraction(null),
  isAuthenticated: createRefraction(false),
  
  login: async (credentials) => {
    try {
      const user = await authAPI.login(credentials);
      userStore.user.set(user);
      userStore.isAuthenticated.set(true);
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    userStore.user.set(null);
    userStore.isAuthenticated.set(false);
  }
};

// components/LoginForm.js
const LoginForm = createComponent(({ lens }) => {
  const email = lens.useRefraction('');
  const password = lens.useRefraction('');
  const isLoading = lens.useRefraction(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    isLoading.set(true);
    
    try {
      await userStore.login({
        email: email.value,
        password: password.value
      });
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      isLoading.set(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email.value}
        onChange={(e) => email.set(e.target.value)}
        placeholder="Email"
        disabled={isLoading.value}
      />
      <input
        type="password"
        value={password.value}
        onChange={(e) => password.set(e.target.value)}
        placeholder="Password"
        disabled={isLoading.value}
      />
      <button type="submit" disabled={isLoading.value}>
        {isLoading.value ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
});
```

## Derived State

### useDerived Hook

```javascript
const ShoppingCart = createComponent(({ lens }) => {
  const items = lens.useRefraction([
    { id: 1, name: 'Apple', price: 1.50, quantity: 2 },
    { id: 2, name: 'Banana', price: 0.75, quantity: 3 }
  ]);
  
  // Derived state automatically updates when items change
  const total = lens.useDerived(() => {
    return items.value.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  }, [items.value]);
  
  const itemCount = lens.useDerived(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0);
  }, [items.value]);
  
  const updateQuantity = (id, newQuantity) => {
    items.set(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  return (
    <div>
      <h2>Shopping Cart ({itemCount.value} items)</h2>
      {items.value.map(item => (
        <div key={item.id}>
          <span>{item.name} - ${item.price}</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            min="0"
          />
        </div>
      ))}
      <h3>Total: ${total.value.toFixed(2)}</h3>
    </div>
  );
});
```

### Complex Derived State

```javascript
const DataAnalytics = createComponent(({ lens }) => {
  const rawData = lens.useRefraction([]);
  const filters = lens.useRefraction({
    category: 'all',
    dateRange: 'week',
    minValue: 0
  });
  
  // Multi-step derived computation
  const filteredData = lens.useDerived(() => {
    return rawData.value.filter(item => {
      if (filters.value.category !== 'all' && item.category !== filters.value.category) {
        return false;
      }
      if (item.value < filters.value.minValue) {
        return false;
      }
      // Add date range filtering logic
      return true;
    });
  }, [rawData.value, filters.value]);
  
  const statistics = lens.useDerived(() => {
    const data = filteredData.value;
    return {
      count: data.length,
      average: data.reduce((sum, item) => sum + item.value, 0) / data.length || 0,
      max: Math.max(...data.map(item => item.value)) || 0,
      min: Math.min(...data.map(item => item.value)) || 0
    };
  }, [filteredData.value]);
  
  return (
    <div>
      <div>
        <select 
          value={filters.value.category}
          onChange={(e) => filters.set(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="all">All Categories</option>
          <option value="sales">Sales</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>
      
      <div>
        <h3>Statistics</h3>
        <p>Count: {statistics.value.count}</p>
        <p>Average: {statistics.value.average.toFixed(2)}</p>
        <p>Max: {statistics.value.max}</p>
        <p>Min: {statistics.value.min}</p>
      </div>
    </div>
  );
});
```

## Advanced Patterns

### Async State Management

```javascript
const AsyncDataComponent = createComponent(({ lens }) => {
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

### State Validation

```javascript
const ValidatedForm = createComponent(({ lens }) => {
  const formData = lens.useRefraction({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const errors = lens.useDerived(() => {
    const data = formData.value;
    const newErrors = {};
    
    if (!data.email.includes('@')) {
      newErrors.email = 'Invalid email format';
    }
    
    if (data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  }, [formData.value]);
  
  const isValid = lens.useDerived(() => {
    return Object.keys(errors.value).length === 0;
  }, [errors.value]);
  
  const updateField = (field, value) => {
    formData.set(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <form>
      <div>
        <input
          type="email"
          value={formData.value.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="Email"
        />
        {errors.value.email && <span className="error">{errors.value.email}</span>}
      </div>
      
      <div>
        <input
          type="password"
          value={formData.value.password}
          onChange={(e) => updateField('password', e.target.value)}
          placeholder="Password"
        />
        {errors.value.password && <span className="error">{errors.value.password}</span>}
      </div>
      
      <div>
        <input
          type="password"
          value={formData.value.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          placeholder="Confirm Password"
        />
        {errors.value.confirmPassword && <span className="error">{errors.value.confirmPassword}</span>}
      </div>
      
      <button type="submit" disabled={!isValid.value}>
        Submit
      </button>
    </form>
  );
});
```

## Performance Considerations

### Avoiding Unnecessary Updates

```javascript
// ✅ Good - Specific updates
const updateSpecificField = () => {
  user.set(prev => ({ ...prev, name: 'New Name' }));
};

// ❌ Bad - Full object replacement for small changes
const updateBadly = () => {
  const newUser = { ...user.value };
  newUser.name = 'New Name';
  user.set(newUser);
};
```

### Batching Updates

```javascript
const BatchedUpdates = createComponent(({ lens }) => {
  const firstName = lens.useRefraction('');
  const lastName = lens.useRefraction('');
  const email = lens.useRefraction('');
  
  const updateAllFields = () => {
    // Batch multiple updates to prevent multiple re-renders
    lens.batch(() => {
      firstName.set('John');
      lastName.set('Doe');
      email.set('john.doe@example.com');
    });
  };
  
  return (
    <div>
      <p>Name: {firstName.value} {lastName.value}</p>
      <p>Email: {email.value}</p>
      <button onClick={updateAllFields}>Update All</button>
    </div>
  );
});
```

## Testing

### Testing Refractions

```javascript
import { renderHook, act } from '@refract/testing-utils';

describe('useRefraction', () => {
  test('initializes with correct value', () => {
    const { result } = renderHook(() => {
      const lens = useLens();
      return lens.useRefraction(42);
    });
    
    expect(result.current.value).toBe(42);
  });
  
  test('updates value correctly', () => {
    const { result } = renderHook(() => {
      const lens = useLens();
      return lens.useRefraction(0);
    });
    
    act(() => {
      result.current.set(10);
    });
    
    expect(result.current.value).toBe(10);
  });
  
  test('functional updates work correctly', () => {
    const { result } = renderHook(() => {
      const lens = useLens();
      return lens.useRefraction(5);
    });
    
    act(() => {
      result.current.set(prev => prev * 2);
    });
    
    expect(result.current.value).toBe(10);
  });
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

### 3. Keep State Focused
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

## Related APIs

- **[createComponent](./createComponent)** - Use refractions in components
- **[useEffect](./useEffect)** - React to refraction changes
- **[useOptic](./useOptic)** - Create reusable logic with refractions
- **[useLens](./useLens)** - Access the lens system
