# useOptic

The `useOptic` hook allows you to use reusable logic patterns (optics) within components. Optics encapsulate complex stateful logic that can be shared across multiple components, providing a clean way to compose functionality.

## Syntax

```javascript
const result = lens.useOptic(opticFunction, dependencies)
```

## Parameters

### `opticFunction`
- **Type:** `() => T`
- **Required:** Yes
- **Description:** Function that returns the optic logic. Called on every render when dependencies change.

### `dependencies`
- **Type:** `any[]`
- **Required:** Yes
- **Description:** Array of values that determine when the optic should be re-executed.

## Return Value

Returns the result of the optic function execution.

## Basic Usage

### Using Built-in Optics

```javascript
import { useCounter } from '@refract/optics';

const CounterComponent = createComponent(({ lens }) => {
  const counter = lens.useOptic(() => useCounter(0), []);
  
  return (
    <div>
      <p>Count: {counter.count}</p>
      <button onClick={counter.decrement}>-</button>
      <button onClick={counter.reset}>Reset</button>
      <button onClick={counter.increment}>+</button>
    </div>
  );
});
```

### Custom Optic Usage

```javascript
// Custom optic for form handling
const useForm = (initialValues) => {
  const values = useRefraction(initialValues);
  const errors = useRefraction({});
  
  const setValue = (field, value) => {
    values.set(prev => ({ ...prev, [field]: value }));
    if (errors.value[field]) {
      errors.set(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    Object.keys(values.value).forEach(field => {
      if (!values.value[field]) {
        newErrors[field] = `${field} is required`;
      }
    });
    errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return {
    values: values.value,
    errors: errors.value,
    setValue,
    validate
  };
};

// Using the custom optic
const LoginForm = createComponent(({ lens }) => {
  const form = lens.useOptic(() => useForm({
    email: '',
    password: ''
  }), []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.validate()) {
      console.log('Form submitted:', form.values);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={form.values.email}
        onChange={(e) => form.setValue('email', e.target.value)}
        placeholder="Email"
      />
      {form.errors.email && <span>{form.errors.email}</span>}
      
      <input
        type="password"
        value={form.values.password}
        onChange={(e) => form.setValue('password', e.target.value)}
        placeholder="Password"
      />
      {form.errors.password && <span>{form.errors.password}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
});
```

## Advanced Patterns

### Parameterized Optics

```javascript
const useFetch = (url, options = {}) => {
  const data = useRefraction(null);
  const loading = useRefraction(false);
  const error = useRefraction(null);
  
  const fetchData = async () => {
    loading.set(true);
    error.set(null);
    
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      data.set(result);
    } catch (err) {
      error.set(err.message);
    } finally {
      loading.set(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [url]);
  
  return {
    data: data.value,
    loading: loading.value,
    error: error.value,
    refetch: fetchData
  };
};

const UserProfile = createComponent(({ lens, userId }) => {
  const { data: user, loading, error, refetch } = lens.useOptic(
    () => useFetch(`/api/users/${userId}`),
    [userId]
  );
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>{user?.name}</h2>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
});
```

### Composed Optics

```javascript
const useUserDashboard = (userId) => {
  const user = useFetch(`/api/users/${userId}`);
  const posts = useFetch(`/api/users/${userId}/posts`);
  const settings = useLocalStorage(`user-${userId}-settings`, {});
  
  const isLoading = user.loading || posts.loading;
  const hasError = user.error || posts.error;
  
  return {
    user: user.data,
    posts: posts.data,
    settings: settings.value,
    updateSettings: settings.setValue,
    isLoading,
    hasError,
    refreshAll: () => {
      user.refetch();
      posts.refetch();
    }
  };
};

const Dashboard = createComponent(({ lens, userId }) => {
  const dashboard = lens.useOptic(() => useUserDashboard(userId), [userId]);
  
  if (dashboard.isLoading) return <div>Loading dashboard...</div>;
  if (dashboard.hasError) return <div>Error loading dashboard</div>;
  
  return (
    <div>
      <h1>Welcome, {dashboard.user?.name}</h1>
      <button onClick={dashboard.refreshAll}>Refresh All</button>
      {/* Dashboard content */}
    </div>
  );
});
```

### Conditional Optics

```javascript
const ConditionalOptic = createComponent(({ lens, shouldUseAdvanced }) => {
  const basicCounter = lens.useOptic(() => useCounter(0), []);
  
  const advancedCounter = lens.useOptic(() => useAdvancedCounter({
    min: 0,
    max: 100,
    step: 5
  }), []);
  
  const counter = shouldUseAdvanced ? advancedCounter : basicCounter;
  
  return (
    <div>
      <p>Count: {counter.count}</p>
      <button onClick={counter.increment}>+</button>
      <button onClick={counter.decrement}>-</button>
    </div>
  );
});
```

## Optic Dependencies

### Static Dependencies

```javascript
const StaticDependencies = createComponent(({ lens }) => {
  // Optic runs once and never re-executes
  const timer = lens.useOptic(() => useTimer(), []);
  
  return <div>Timer: {timer.seconds}</div>;
});
```

### Dynamic Dependencies

```javascript
const DynamicDependencies = createComponent(({ lens, config }) => {
  // Optic re-executes when config changes
  const api = lens.useOptic(() => useApiClient(config), [config]);
  
  return <div>API Status: {api.status}</div>;
});
```

### Multiple Dependencies

```javascript
const MultipleDependencies = createComponent(({ lens, userId, theme }) => {
  // Optic re-executes when either userId or theme changes
  const userInterface = lens.useOptic(() => 
    useThemedUserInterface(userId, theme), 
    [userId, theme]
  );
  
  return <div className={userInterface.className}>Content</div>;
});
```

## Performance Considerations

### Memoizing Expensive Optics

```javascript
const ExpensiveOptic = createComponent(({ lens, data }) => {
  // Memoize expensive computation
  const processedData = lens.useOptic(() => {
    return useExpensiveDataProcessor(data);
  }, [data]);
  
  return <div>{processedData.result}</div>;
});
```

### Avoiding Unnecessary Re-executions

```javascript
const OptimizedOptic = createComponent(({ lens, user }) => {
  // Only re-execute when user ID changes, not when other user properties change
  const userPreferences = lens.useOptic(() => 
    useUserPreferences(user.id), 
    [user.id] // Specific dependency instead of entire user object
  );
  
  return <div>Theme: {userPreferences.theme}</div>;
});
```

## Error Handling

### Optic Error Boundaries

```javascript
const SafeOptic = createComponent(({ lens, config }) => {
  const result = lens.useOptic(() => {
    try {
      return useRiskyOptic(config);
    } catch (error) {
      console.error('Optic error:', error);
      return { error: error.message, data: null };
    }
  }, [config]);
  
  if (result.error) {
    return <div>Error: {result.error}</div>;
  }
  
  return <div>{result.data}</div>;
});
```

### Graceful Degradation

```javascript
const GracefulOptic = createComponent(({ lens, features }) => {
  const enhancement = lens.useOptic(() => {
    if (features.advanced) {
      try {
        return useAdvancedFeatures();
      } catch (error) {
        console.warn('Advanced features unavailable:', error);
        return useBasicFeatures();
      }
    }
    return useBasicFeatures();
  }, [features.advanced]);
  
  return <div>{enhancement.render()}</div>;
});
```

## Testing Optics with useOptic

### Mocking Optics

```javascript
// Mock the optic for testing
jest.mock('@refract/optics', () => ({
  useCounter: jest.fn()
}));

import { useCounter } from '@refract/optics';

describe('CounterComponent', () => {
  test('uses counter optic correctly', () => {
    const mockCounter = {
      count: 5,
      increment: jest.fn(),
      decrement: jest.fn(),
      reset: jest.fn()
    };
    
    useCounter.mockReturnValue(mockCounter);
    
    const { getByText, getByRole } = render(<CounterComponent />);
    
    expect(getByText('Count: 5')).toBeInTheDocument();
    
    fireEvent.click(getByRole('button', { name: '+' }));
    expect(mockCounter.increment).toHaveBeenCalled();
  });
});
```

### Testing Optic Dependencies

```javascript
test('re-executes optic when dependencies change', () => {
  const mockOptic = jest.fn(() => ({ data: 'test' }));
  
  const TestComponent = createComponent(({ lens, dep }) => {
    const result = lens.useOptic(mockOptic, [dep]);
    return <div>{result.data}</div>;
  });
  
  const { rerender } = render(<TestComponent dep="initial" />);
  
  expect(mockOptic).toHaveBeenCalledTimes(1);
  
  rerender(<TestComponent dep="changed" />);
  
  expect(mockOptic).toHaveBeenCalledTimes(2);
});
```

## Common Optic Patterns

### Data Fetching Optic

```javascript
const useFetchWithCache = (url) => {
  const cache = useRefraction(new Map());
  const data = useRefraction(null);
  const loading = useRefraction(false);
  
  useEffect(() => {
    if (cache.value.has(url)) {
      data.set(cache.value.get(url));
      return;
    }
    
    loading.set(true);
    fetch(url)
      .then(response => response.json())
      .then(result => {
        cache.set(prev => new Map(prev).set(url, result));
        data.set(result);
      })
      .finally(() => loading.set(false));
  }, [url]);
  
  return { data: data.value, loading: loading.value };
};
```

### Form Validation Optic

```javascript
const useFormValidation = (values, rules) => {
  const errors = useRefraction({});
  const isValid = useRefraction(true);
  
  useEffect(() => {
    const newErrors = {};
    
    Object.keys(rules).forEach(field => {
      const value = values[field];
      const rule = rules[field];
      
      if (rule.required && !value) {
        newErrors[field] = `${field} is required`;
      } else if (rule.minLength && value.length < rule.minLength) {
        newErrors[field] = `${field} must be at least ${rule.minLength} characters`;
      }
    });
    
    errors.set(newErrors);
    isValid.set(Object.keys(newErrors).length === 0);
  }, [values, rules]);
  
  return {
    errors: errors.value,
    isValid: isValid.value
  };
};
```

### Animation Optic

```javascript
const useAnimation = (duration = 300) => {
  const progress = useRefraction(0);
  const isAnimating = useRefraction(false);
  
  const animate = (from, to) => {
    return new Promise(resolve => {
      isAnimating.set(true);
      const startTime = Date.now();
      
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const normalizedProgress = Math.min(elapsed / duration, 1);
        
        progress.set(normalizedProgress);
        
        if (normalizedProgress < 1) {
          requestAnimationFrame(tick);
        } else {
          isAnimating.set(false);
          resolve();
        }
      };
      
      requestAnimationFrame(tick);
    });
  };
  
  return {
    progress: progress.value,
    isAnimating: isAnimating.value,
    animate
  };
};
```

## Best Practices

### 1. Use Descriptive Names
```javascript
// ✅ Good
const userAuth = lens.useOptic(() => useAuthentication(), []);
const formValidation = lens.useOptic(() => useFormValidation(values, rules), [values, rules]);

// ❌ Bad
const auth = lens.useOptic(() => useAuth(), []);
const validation = lens.useOptic(() => useValidation(), []);
```

### 2. Keep Dependencies Specific
```javascript
// ✅ Good - Specific dependencies
const api = lens.useOptic(() => useApiClient(config.apiUrl), [config.apiUrl]);

// ❌ Bad - Too broad
const api = lens.useOptic(() => useApiClient(config.apiUrl), [config]);
```

### 3. Handle Loading States
```javascript
// ✅ Good - Proper loading handling
const data = lens.useOptic(() => useFetch(url), [url]);

if (data.loading) return <div>Loading...</div>;
if (data.error) return <div>Error: {data.error}</div>;

return <div>{data.result}</div>;
```

### 4. Compose Optics Thoughtfully
```javascript
// ✅ Good - Logical composition
const dashboard = lens.useOptic(() => {
  const user = useUser(userId);
  const preferences = usePreferences(userId);
  return { user, preferences };
}, [userId]);

// ❌ Bad - Unrelated optics composed
const mixed = lens.useOptic(() => {
  const user = useUser(userId);
  const weather = useWeather(location);
  return { user, weather }; // Unrelated concerns
}, [userId, location]);
```

## Related APIs

- **[createOptic](./createOptic)** - Create custom optics
- **[useRefraction](./useRefraction)** - State management within optics
- **[useEffect](./useEffect)** - Side effects within optics
- **[createComponent](./createComponent)** - Components that use optics
