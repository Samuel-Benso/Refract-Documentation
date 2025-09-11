# createComponent

The `createComponent` function creates reactive components in Refract. Components are pure functions that receive props and a lens, returning JSX that describes the UI. They automatically re-render when their reactive dependencies change.

## Syntax

```javascript
createComponent((props) => JSX.Element)
```

## Parameters

### `componentFunction`
- **Type:** `(props: Props & { lens: Lens }) => JSX.Element`
- **Required:** Yes
- **Description:** A function that receives props (including lens) and returns JSX

## Return Value

Returns a `Component` that can be used in JSX or passed to other Refract functions.

## Basic Usage

### Simple Component

```javascript
import { createComponent } from 'refract';

const Greeting = createComponent(({ lens, name }) => {
  return <h1>Hello, {name}!</h1>;
});

// Usage
<Greeting name="World" />
```

### Component with State

```javascript
const Counter = createComponent(({ lens, initialCount = 0 }) => {
  const count = lens.useRefraction(initialCount);
  
  const increment = () => count.set(count.value + 1);
  const decrement = () => count.set(count.value - 1);
  
  return (
    <div>
      <h2>Count: {count.value}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
});
```

### Component with Effects

```javascript
const UserProfile = createComponent(({ lens, userId }) => {
  const user = lens.useRefraction(null);
  const loading = lens.useRefraction(true);
  const error = lens.useRefraction(null);
  
  lens.useEffect(() => {
    const fetchUser = async () => {
      try {
        loading.set(true);
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        user.set(userData);
      } catch (err) {
        error.set(err.message);
      } finally {
        loading.set(false);
      }
    };
    
    fetchUser();
  }, [userId]);
  
  if (loading.value) return <div>Loading...</div>;
  if (error.value) return <div>Error: {error.value}</div>;
  
  return (
    <div>
      <h2>{user.value?.name}</h2>
      <p>{user.value?.email}</p>
    </div>
  );
});
```

## Component Props

### Lens Parameter

Every component receives a `lens` parameter that provides access to reactive features:

```javascript
const MyComponent = createComponent(({ lens, ...otherProps }) => {
  // lens.useRefraction() - Create reactive state
  // lens.useEffect() - Handle side effects
  // lens.useOptic() - Use reusable logic
  // lens.useDerived() - Create computed values
  // lens.batch() - Batch multiple updates
  
  return <div>Component content</div>;
});
```

### Custom Props

Components can receive any custom props:

```javascript
const BlogPost = createComponent(({ lens, title, content, author, publishedAt }) => {
  const isExpanded = lens.useRefraction(false);
  
  return (
    <article>
      <h2>{title}</h2>
      <p>By {author} on {publishedAt}</p>
      <div>
        {isExpanded.value ? content : `${content.substring(0, 100)}...`}
        <button onClick={() => isExpanded.set(!isExpanded.value)}>
          {isExpanded.value ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </article>
  );
});

// Usage
<BlogPost 
  title="Getting Started with Refract"
  content="Refract is a reactive JavaScript framework..."
  author="Jane Doe"
  publishedAt="2024-01-15"
/>
```

## Advanced Patterns

### Higher-Order Components

```javascript
const withLoading = (WrappedComponent) => {
  return createComponent((props) => {
    const { lens, isLoading, loadingText = 'Loading...', ...otherProps } = props;
    
    if (isLoading) {
      return <div className="loading">{loadingText}</div>;
    }
    
    return <WrappedComponent lens={lens} {...otherProps} />;
  });
};

// Usage
const DataDisplay = createComponent(({ lens, data }) => {
  return <div>{JSON.stringify(data)}</div>;
});

const DataDisplayWithLoading = withLoading(DataDisplay);

<DataDisplayWithLoading 
  isLoading={!data} 
  data={data}
  loadingText="Fetching data..."
/>
```

### Render Props Pattern

```javascript
const DataFetcher = createComponent(({ lens, url, children }) => {
  const data = lens.useRefraction(null);
  const loading = lens.useRefraction(true);
  const error = lens.useRefraction(null);
  
  lens.useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(result => {
        data.set(result);
        loading.set(false);
      })
      .catch(err => {
        error.set(err);
        loading.set(false);
      });
  }, [url]);
  
  return children({
    data: data.value,
    loading: loading.value,
    error: error.value
  });
});

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return <UserList users={data} />;
  }}
</DataFetcher>
```

### Compound Components

```javascript
const Tabs = createComponent(({ lens, children, defaultTab = 0 }) => {
  const activeTab = lens.useRefraction(defaultTab);
  
  return (
    <div className="tabs">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isActive: index === activeTab.value,
          onActivate: () => activeTab.set(index)
        })
      )}
    </div>
  );
});

const Tab = createComponent(({ lens, title, children, isActive, onActivate }) => {
  return (
    <div className="tab">
      <button 
        className={`tab-button ${isActive ? 'active' : ''}`}
        onClick={onActivate}
      >
        {title}
      </button>
      {isActive && (
        <div className="tab-content">
          {children}
        </div>
      )}
    </div>
  );
});

// Usage
<Tabs defaultTab={0}>
  <Tab title="Profile">
    <UserProfile />
  </Tab>
  <Tab title="Settings">
    <UserSettings />
  </Tab>
</Tabs>
```

## Performance Optimization

### memo()

Prevent unnecessary re-renders with memoization:

```javascript
import { memo } from 'refract';

const ExpensiveComponent = memo(createComponent(({ lens, data }) => {
  // Expensive computation or rendering
  const processedData = lens.useDerived(() => {
    return data.map(item => expensiveTransform(item));
  }, [data]);
  
  return (
    <div>
      {processedData.value.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}));

// Custom comparison function
const CustomMemoComponent = memo(
  createComponent(({ lens, user }) => {
    return <div>{user.name}</div>;
  }),
  (prevProps, nextProps) => {
    // Only re-render if user ID changes
    return prevProps.user.id === nextProps.user.id;
  }
);
```

### lazy()

Code-split components for better performance:

```javascript
import { lazy, Suspense } from 'refract';

const LazyComponent = lazy(() => import('./HeavyComponent'));

const App = createComponent(({ lens }) => {
  const showHeavy = lens.useRefraction(false);
  
  return (
    <div>
      <h1>My App</h1>
      <button onClick={() => showHeavy.set(!showHeavy.value)}>
        Toggle Heavy Component
      </button>
      
      {showHeavy.value && (
        <Suspense fallback={<div>Loading heavy component...</div>}>
          <LazyComponent />
        </Suspense>
      )}
    </div>
  );
});
```

## Component Lifecycle

### Mount Phase

```javascript
const LifecycleComponent = createComponent(({ lens }) => {
  const data = lens.useRefraction(null);
  
  // Runs once when component mounts
  lens.useEffect(() => {
    console.log('Component mounted');
    
    // Fetch initial data
    fetchData().then(data.set);
    
    // Cleanup on unmount
    return () => {
      console.log('Component unmounting');
    };
  }, []); // Empty dependency array
  
  return <div>{data.value || 'Loading...'}</div>;
});
```

### Update Phase

```javascript
const UpdateComponent = createComponent(({ lens, userId }) => {
  const user = lens.useRefraction(null);
  
  // Runs when userId changes
  lens.useEffect(() => {
    console.log('UserId changed:', userId);
    fetchUser(userId).then(user.set);
  }, [userId]); // Dependency array with userId
  
  return <div>{user.value?.name}</div>;
});
```

## Error Handling

### Component Error Boundaries

```javascript
const ErrorBoundary = createComponent(({ lens, children }) => {
  const hasError = lens.useRefraction(false);
  const error = lens.useRefraction(null);
  
  // This would be handled by Refract's error system
  if (hasError.value) {
    return (
      <div className="error-boundary">
        <h2>Something went wrong</h2>
        <details>
          <summary>Error details</summary>
          <pre>{error.value?.stack}</pre>
        </details>
        <button onClick={() => hasError.set(false)}>
          Try again
        </button>
      </div>
    );
  }
  
  return children;
});
```

### Safe Async Operations

```javascript
const SafeAsyncComponent = createComponent(({ lens }) => {
  const data = lens.useRefraction(null);
  const error = lens.useRefraction(null);
  
  lens.useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        const result = await apiCall();
        if (!cancelled) {
          data.set(result);
        }
      } catch (err) {
        if (!cancelled) {
          error.set(err.message);
        }
      }
    };
    
    fetchData();
    
    return () => {
      cancelled = true;
    };
  }, []);
  
  if (error.value) {
    return <div>Error: {error.value}</div>;
  }
  
  return <div>{data.value || 'Loading...'}</div>;
});
```

## Testing Components

### Unit Testing

```javascript
import { render, fireEvent } from '@refract/testing-utils';

describe('Counter Component', () => {
  test('increments count when button clicked', () => {
    const { getByText, getByRole } = render(<Counter initialCount={0} />);
    
    expect(getByText('Count: 0')).toBeInTheDocument();
    
    fireEvent.click(getByRole('button', { name: '+' }));
    
    expect(getByText('Count: 1')).toBeInTheDocument();
  });
  
  test('decrements count when button clicked', () => {
    const { getByText, getByRole } = render(<Counter initialCount={5} />);
    
    expect(getByText('Count: 5')).toBeInTheDocument();
    
    fireEvent.click(getByRole('button', { name: '-' }));
    
    expect(getByText('Count: 4')).toBeInTheDocument();
  });
});
```

### Integration Testing

```javascript
test('UserProfile fetches and displays user data', async () => {
  const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
  
  fetch.mockResolvedValueOnce({
    json: async () => mockUser
  });
  
  const { getByText, queryByText } = render(<UserProfile userId={1} />);
  
  // Initially shows loading
  expect(getByText('Loading...')).toBeInTheDocument();
  
  // Wait for data to load
  await waitFor(() => {
    expect(queryByText('Loading...')).not.toBeInTheDocument();
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('john@example.com')).toBeInTheDocument();
  });
});
```

## Best Practices

### 1. Keep Components Pure
```javascript
// ✅ Good - Pure component
const PureComponent = createComponent(({ lens, name }) => {
  return <h1>Hello, {name}!</h1>;
});

// ❌ Bad - Side effects in render
const ImpureComponent = createComponent(({ lens, name }) => {
  console.log('Rendering...'); // Side effect!
  return <h1>Hello, {name}!</h1>;
});
```

### 2. Use Descriptive Names
```javascript
// ✅ Good
const UserProfileCard = createComponent(({ lens, user }) => {
  // Component logic
});

// ❌ Bad
const Component1 = createComponent(({ lens, data }) => {
  // Component logic
});
```

### 3. Extract Complex Logic
```javascript
// ✅ Good - Logic in custom optic
const useUserData = (userId) => {
  const user = useRefraction(null);
  const loading = useRefraction(true);
  
  useEffect(() => {
    fetchUser(userId).then(user.set).finally(() => loading.set(false));
  }, [userId]);
  
  return { user: user.value, loading: loading.value };
};

const UserProfile = createComponent(({ lens, userId }) => {
  const { user, loading } = lens.useOptic(() => useUserData(userId), [userId]);
  
  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
});
```

### 4. Handle Edge Cases
```javascript
const SafeComponent = createComponent(({ lens, items = [] }) => {
  if (!Array.isArray(items)) {
    return <div>Invalid data provided</div>;
  }
  
  if (items.length === 0) {
    return <div>No items to display</div>;
  }
  
  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.id || index}>
          {item.name || 'Unnamed item'}
        </li>
      ))}
    </ul>
  );
});
```

## Related APIs

- **[createApp](./createApp)** - Initialize applications with components
- **[useRefraction](./useRefraction)** - Manage component state
- **[useEffect](./useEffect)** - Handle component side effects
- **[useOptic](./useOptic)** - Use reusable logic in components
