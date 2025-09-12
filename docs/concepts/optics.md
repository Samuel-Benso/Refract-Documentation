# Optics

Optics are Refract's composable logic units that encapsulate reusable patterns and behaviors. They're similar to React hooks but designed specifically for Refract's reactive system, providing a clean way to share stateful logic between components while maintaining proper reactivity and lifecycle management.

## What are Optics?

An optic is a reusable function that encapsulates reactive logic, state management, and side effects. Optics can be composed together to create complex behaviors from simple, testable units.

```javascript
import { createOptic } from 'refract';

// Basic optic for counter logic
const useCounter = createOptic((initialValue = 0) => {
  const count = useRefraction(initialValue);
  
  const increment = () => count.set(count.value + 1);
  const decrement = () => count.set(count.value - 1);
  const reset = () => count.set(initialValue);
  
  return {
    count: count.value,
    increment,
    decrement,
    reset
  };
});

// Using the optic in a component
const Counter = createComponent(({ lens }) => {
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

## Creating Optics

### Basic Optic Structure

```javascript
import { createOptic, useRefraction, useEffect } from 'refract';

const useToggle = createOptic((initialValue = false) => {
  const isToggled = useRefraction(initialValue);
  
  const toggle = () => isToggled.set(!isToggled.value);
  const setToggle = (value) => isToggled.set(value);
  
  return {
    isToggled: isToggled.value,
    toggle,
    setToggle
  };
});
```

### Optics with Side Effects

```javascript
const useLocalStorage = createOptic((key, defaultValue) => {
  // Initialize from localStorage
  const getStoredValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  };
  
  const storedValue = useRefraction(getStoredValue());
  
  // Sync to localStorage when value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue.value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [storedValue.value, key]);
  
  return {
    value: storedValue.value,
    setValue: storedValue.set
  };
});

// Usage
const Settings = createComponent(({ lens }) => {
  const theme = lens.useOptic(() => useLocalStorage('theme', 'light'), []);
  
  return (
    <div>
      <p>Current theme: {theme.value}</p>
      <button onClick={() => theme.setValue(theme.value === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
});
```

## Advanced Optic Patterns

### Async Data Fetching

```javascript
const useFetch = createOptic((url, options = {}) => {
  const data = useRefraction(null);
  const loading = useRefraction(false);
  const error = useRefraction(null);
  
  const fetchData = async () => {
    loading.set(true);
    error.set(null);
    
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      data.set(result);
    } catch (err) {
      error.set(err.message);
    } finally {
      loading.set(false);
    }
  };
  
  // Auto-fetch on mount and when URL changes
  useEffect(() => {
    fetchData();
  }, [url]);
  
  return {
    data: data.value,
    loading: loading.value,
    error: error.value,
    refetch: fetchData
  };
});

// Usage
const UserProfile = createComponent(({ lens, userId }) => {
  const { data: user, loading, error, refetch } = lens.useOptic(
    () => useFetch(`/api/users/${userId}`),
    [userId]
  );
  
  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
});
```

### Form Management

```javascript
const useForm = createOptic((initialValues, validationSchema = {}) => {
  const values = useRefraction(initialValues);
  const errors = useRefraction({});
  const touched = useRefraction({});
  const isSubmitting = useRefraction(false);
  
  const setValue = (field, value) => {
    values.set(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors.value[field]) {
      errors.set(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const setTouched = (field) => {
    touched.set(prev => ({ ...prev, [field]: true }));
  };
  
  const validate = () => {
    const newErrors = {};
    
    Object.keys(validationSchema).forEach(field => {
      const rules = validationSchema[field];
      const value = values.value[field];
      
      if (rules.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = `${field} is required`;
        return;
      }
      
      if (rules.minLength && value && value.length < rules.minLength) {
        newErrors[field] = `${field} must be at least ${rules.minLength} characters`;
        return;
      }
      
      if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = rules.message || `${field} format is invalid`;
        return;
      }
    });
    
    errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (onSubmit) => {
    // Mark all fields as touched
    const allFields = Object.keys(initialValues);
    const touchedState = {};
    allFields.forEach(field => touchedState[field] = true);
    touched.set(touchedState);
    
    if (!validate()) {
      return;
    }
    
    isSubmitting.set(true);
    
    try {
      await onSubmit(values.value);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      isSubmitting.set(false);
    }
  };
  
  const reset = () => {
    values.set(initialValues);
    errors.set({});
    touched.set({});
    isSubmitting.set(false);
  };
  
  return {
    values: values.value,
    errors: errors.value,
    touched: touched.value,
    isSubmitting: isSubmitting.value,
    setValue,
    setTouched,
    validate,
    handleSubmit,
    reset
  };
});

// Usage
const ContactForm = createComponent(({ lens }) => {
  const form = lens.useOptic(() => useForm(
    { name: '', email: '', message: '' },
    {
      name: { required: true, minLength: 2 },
      email: { 
        required: true, 
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      message: { required: true, minLength: 10 }
    }
  ), []);
  
  const onSubmit = async (data) => {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    form.reset();
    alert('Message sent successfully!');
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit(onSubmit);
    }}>
      <div>
        <input
          value={form.values.name}
          onChange={(e) => form.setValue('name', e.target.value)}
          onBlur={() => form.setTouched('name')}
          placeholder="Name"
          className={form.touched.name && form.errors.name ? 'error' : ''}
        />
        {form.touched.name && form.errors.name && (
          <span className="error-message">{form.errors.name}</span>
        )}
      </div>
      
      <div>
        <input
          type="email"
          value={form.values.email}
          onChange={(e) => form.setValue('email', e.target.value)}
          onBlur={() => form.setTouched('email')}
          placeholder="Email"
          className={form.touched.email && form.errors.email ? 'error' : ''}
        />
        {form.touched.email && form.errors.email && (
          <span className="error-message">{form.errors.email}</span>
        )}
      </div>
      
      <div>
        <textarea
          value={form.values.message}
          onChange={(e) => form.setValue('message', e.target.value)}
          onBlur={() => form.setTouched('message')}
          placeholder="Message"
          className={form.touched.message && form.errors.message ? 'error' : ''}
        />
        {form.touched.message && form.errors.message && (
          <span className="error-message">{form.errors.message}</span>
        )}
      </div>
      
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
});
```

### Animation and Transitions

```javascript
const useAnimation = createOptic((duration = 300, easing = 'ease-out') => {
  const isAnimating = useRefraction(false);
  const progress = useRefraction(0);
  
  const animate = (from, to, onUpdate) => {
    return new Promise((resolve) => {
      isAnimating.set(true);
      progress.set(0);
      
      const startTime = Date.now();
      const difference = to - from;
      
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const normalizedProgress = Math.min(elapsed / duration, 1);
        
        // Apply easing
        let easedProgress;
        switch (easing) {
          case 'ease-in':
            easedProgress = normalizedProgress * normalizedProgress;
            break;
          case 'ease-out':
            easedProgress = 1 - Math.pow(1 - normalizedProgress, 2);
            break;
          default:
            easedProgress = normalizedProgress;
        }
        
        progress.set(easedProgress);
        const currentValue = from + (difference * easedProgress);
        onUpdate(currentValue);
        
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
    isAnimating: isAnimating.value,
    progress: progress.value,
    animate
  };
});

// Usage
const AnimatedCounter = createComponent(({ lens, target }) => {
  const displayValue = lens.useRefraction(0);
  const animation = lens.useOptic(() => useAnimation(1000, 'ease-out'), []);
  
  lens.useEffect(() => {
    animation.animate(
      displayValue.value,
      target,
      (value) => displayValue.set(Math.round(value))
    );
  }, [target]);
  
  return (
    <div className="animated-counter">
      <span className="counter-value">{displayValue.value}</span>
      {animation.isAnimating && (
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${animation.progress * 100}%` }}
          />
        </div>
      )}
    </div>
  );
});
```

## Optic Composition

### Combining Multiple Optics

```javascript
const useUserDashboard = createOptic((userId) => {
  // Compose multiple optics
  const user = useFetch(`/api/users/${userId}`);
  const posts = useFetch(`/api/users/${userId}/posts`);
  const settings = useLocalStorage(`user-${userId}-settings`, {});
  
  const isLoading = user.loading || posts.loading;
  const hasError = user.error || posts.error;
  
  const refreshAll = () => {
    user.refetch();
    posts.refetch();
  };
  
  return {
    user: user.data,
    posts: posts.data,
    settings: settings.value,
    updateSettings: settings.setValue,
    isLoading,
    hasError,
    refreshAll
  };
});

// Usage
const UserDashboard = createComponent(({ lens, userId }) => {
  const dashboard = lens.useOptic(() => useUserDashboard(userId), [userId]);
  
  if (dashboard.isLoading) return <div>Loading dashboard...</div>;
  if (dashboard.hasError) return <div>Error loading dashboard</div>;
  
  return (
    <div className="user-dashboard">
      <header>
        <h1>Welcome, {dashboard.user?.name}</h1>
        <button onClick={dashboard.refreshAll}>Refresh</button>
      </header>
      
      <section>
        <h2>Recent Posts</h2>
        {dashboard.posts?.map(post => (
          <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </section>
    </div>
  );
});
```

### Higher-Order Optics

```javascript
const withRetry = (optic, maxRetries = 3) => {
  return createOptic((...args) => {
    const result = optic(...args);
    const retryCount = useRefraction(0);
    
    const retryOperation = async () => {
      if (retryCount.value < maxRetries) {
        retryCount.set(retryCount.value + 1);
        if (result.refetch) {
          await result.refetch();
        }
      }
    };
    
    return {
      ...result,
      retryCount: retryCount.value,
      canRetry: retryCount.value < maxRetries,
      retry: retryOperation
    };
  });
};

// Usage
const useReliableFetch = withRetry(useFetch, 3);

const ReliableDataComponent = createComponent(({ lens, url }) => {
  const { data, loading, error, canRetry, retry } = lens.useOptic(
    () => useReliableFetch(url),
    [url]
  );
  
  if (loading) return <div>Loading...</div>;
  
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        {canRetry && (
          <button onClick={retry}>Retry</button>
        )}
      </div>
    );
  }
  
  return <div>{JSON.stringify(data)}</div>;
});
```

## Testing Optics

### Unit Testing Optics

```javascript
// optics/useCounter.test.js
import { renderOptic } from '@refract/testing-utils';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  test('initializes with default value', () => {
    const { result } = renderOptic(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });
  
  test('initializes with custom value', () => {
    const { result } = renderOptic(() => useCounter(5));
    
    expect(result.current.count).toBe(5);
  });
  
  test('increments count', () => {
    const { result } = renderOptic(() => useCounter(0));
    
    result.current.increment();
    
    expect(result.current.count).toBe(1);
  });
  
  test('decrements count', () => {
    const { result } = renderOptic(() => useCounter(5));
    
    result.current.decrement();
    
    expect(result.current.count).toBe(4);
  });
  
  test('resets to initial value', () => {
    const { result } = renderOptic(() => useCounter(10));
    
    result.current.increment();
    result.current.increment();
    expect(result.current.count).toBe(12);
    
    result.current.reset();
    expect(result.current.count).toBe(10);
  });
});
```

### Integration Testing

```javascript
// components/Counter.test.js
import { render, fireEvent } from '@refract/testing-utils';
import { Counter } from './Counter';

describe('Counter Component', () => {
  test('displays initial count and responds to clicks', () => {
    const { getByText, getByRole } = render(<Counter />);
    
    expect(getByText('Count: 0')).toBeInTheDocument();
    
    fireEvent.click(getByRole('button', { name: '+' }));
    expect(getByText('Count: 1')).toBeInTheDocument();
    
    fireEvent.click(getByRole('button', { name: '-' }));
    expect(getByText('Count: 0')).toBeInTheDocument();
    
    fireEvent.click(getByRole('button', { name: 'Reset' }));
    expect(getByText('Count: 0')).toBeInTheDocument();
  });
});
```

## Best Practices

### 1. Keep Optics Focused
```javascript
// ✅ Good - Single responsibility
const useCounter = createOptic((initialValue = 0) => {
  // Only counter logic
});

const useTimer = createOptic(() => {
  // Only timer logic
});

// ❌ Bad - Multiple responsibilities
const useCounterAndTimer = createOptic(() => {
  // Counter and timer logic mixed together
});
```

### 2. Use Descriptive Names
```javascript
// ✅ Good
const useUserAuthentication = createOptic(() => { /* ... */ });
const useShoppingCart = createOptic(() => { /* ... */ });
const useFormValidation = createOptic(() => { /* ... */ });

// ❌ Bad
const useData = createOptic(() => { /* ... */ });
const useStuff = createOptic(() => { /* ... */ });
const useHelper = createOptic(() => { /* ... */ });
```

### 3. Handle Edge Cases
```javascript
const useSafeLocalStorage = createOptic((key, defaultValue) => {
  const getValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Failed to parse localStorage item "${key}":`, error);
      return defaultValue;
    }
  };
  
  const value = useRefraction(getValue());
  
  const setValue = (newValue) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
      value.set(newValue);
    } catch (error) {
      console.error(`Failed to set localStorage item "${key}":`, error);
    }
  };
  
  return { value: value.value, setValue };
});
```

### 4. Provide Cleanup
```javascript
const useWebSocket = createOptic((url) => {
  const messages = useRefraction([]);
  const connectionStatus = useRefraction('connecting');
  
  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => connectionStatus.set('connected');
    ws.onclose = () => connectionStatus.set('disconnected');
    ws.onmessage = (event) => {
      messages.set(prev => [...prev, JSON.parse(event.data)]);
    };
    
    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [url]);
  
  return {
    messages: messages.value,
    connectionStatus: connectionStatus.value
  };
});
```

## Next Steps

Now that you understand optics, explore:
- **[Effects](./effects)** - Advanced side effect management
- **[API Reference](../api/overview)** - Complete API documentation
- **[Tutorials](../tutorials/counter-app)** - Practical examples using optics
