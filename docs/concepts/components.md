# Components

Components are the building blocks of Refract applications. They are pure functions that describe what the UI should look like based on the current state. Unlike traditional frameworks, Refract components are created using the `createComponent()` function and receive reactive capabilities through the lens system.

## Creating Components

### Basic Component Structure

```javascript
import { createComponent } from 'refract';

const MyComponent = createComponent(({ lens, ...props }) => {
  // Component logic here
  
  return (
    <div>
      <h1>Hello, Refract!</h1>
    </div>
  );
});

export default MyComponent;
```

### Component with Props

```javascript
const Greeting = createComponent(({ lens, name, age }) => {
  return (
    <div className="greeting">
      <h2>Hello, {name}!</h2>
      <p>You are {age} years old.</p>
    </div>
  );
});

// Usage
<Greeting name="Alice" age={25} />
```

## Component Lifecycle

Refract components have a simplified lifecycle compared to class-based components:

### Mount Phase
When a component is first created and added to the DOM:

```javascript
const LifecycleExample = createComponent(({ lens }) => {
  const data = lens.useRefraction(null);
  
  // Runs once when component mounts
  lens.useEffect(() => {
    console.log('Component mounted');
    fetchData().then(data.set);
  }, []); // Empty dependency array = mount only
  
  return <div>{data.value ? 'Data loaded!' : 'Loading...'}</div>;
});
```

### Update Phase
When props or state change:

```javascript
const UpdateExample = createComponent(({ lens, userId }) => {
  const user = lens.useRefraction(null);
  
  // Runs when userId prop changes
  lens.useEffect(() => {
    console.log('Fetching user:', userId);
    fetchUser(userId).then(user.set);
  }, [userId]); // Dependency array includes userId
  
  return <div>{user.value?.name || 'Loading user...'}</div>;
});
```

### Cleanup Phase
When a component is removed from the DOM:

```javascript
const CleanupExample = createComponent(({ lens }) => {
  lens.useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);
    
    // Cleanup function
    return () => {
      console.log('Component unmounting');
      clearInterval(timer);
    };
  }, []);
  
  return <div>Timer running...</div>;
});
```

## State Management in Components

### Local State with Refractions

```javascript
const Counter = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  const step = lens.useRefraction(1);
  
  const increment = () => count.set(count.value + step.value);
  const decrement = () => count.set(count.value - step.value);
  
  return (
    <div>
      <h3>Count: {count.value}</h3>
      <input 
        type="number" 
        value={step.value}
        onChange={(e) => step.set(Number(e.target.value))}
        placeholder="Step size"
      />
      <button onClick={decrement}>-{step.value}</button>
      <button onClick={increment}>+{step.value}</button>
    </div>
  );
});
```

### Computed Values

```javascript
const ShoppingCart = createComponent(({ lens }) => {
  const items = lens.useRefraction([
    { id: 1, name: 'Apple', price: 1.50, quantity: 2 },
    { id: 2, name: 'Banana', price: 0.75, quantity: 3 }
  ]);
  
  // Computed value using useOptic
  const total = lens.useOptic(() => {
    return items.value.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  }, [items.value]);
  
  return (
    <div>
      <h3>Shopping Cart</h3>
      {items.value.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price} x {item.quantity}
        </div>
      ))}
      <h4>Total: ${total.toFixed(2)}</h4>
    </div>
  );
});
```

## Component Composition

### Parent-Child Communication

```javascript
// Child component
const TodoItem = createComponent(({ lens, todo, onToggle, onDelete }) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});

// Parent component
const TodoList = createComponent(({ lens }) => {
  const todos = lens.useRefraction([
    { id: 1, text: 'Learn Refract', completed: false },
    { id: 2, text: 'Build an app', completed: false }
  ]);
  
  const toggleTodo = (id) => {
    todos.set(todos.value.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    todos.set(todos.value.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <h2>Todo List</h2>
      {todos.value.map(todo => (
        <TodoItem 
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
});
```

### Higher-Order Components (HOCs)

```javascript
// HOC for adding loading state
const withLoading = (WrappedComponent) => {
  return createComponent((props) => {
    const { lens, isLoading, ...otherProps } = props;
    
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }
    
    return <WrappedComponent lens={lens} {...otherProps} />;
  });
};

// Usage
const DataDisplay = createComponent(({ lens, data }) => {
  return <div>{JSON.stringify(data)}</div>;
});

const DataDisplayWithLoading = withLoading(DataDisplay);

// In parent component
<DataDisplayWithLoading 
  isLoading={!data.value} 
  data={data.value} 
/>
```

## Component Patterns

### Render Props Pattern

```javascript
const DataFetcher = createComponent(({ lens, url, children }) => {
  const data = lens.useRefraction(null);
  const loading = lens.useRefraction(true);
  const error = lens.useRefraction(null);
  
  lens.useEffect(() => {
    loading.set(true);
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
    if (loading) return <div>Loading...</div>;
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
      {children.map((child, index) => 
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
        className={`tab-header ${isActive ? 'active' : ''}`}
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

### Memoization

```javascript
import { memo } from 'refract';

const ExpensiveComponent = memo(createComponent(({ lens, data }) => {
  // Expensive computation
  const processedData = lens.useOptic(() => {
    return data.map(item => ({
      ...item,
      processed: heavyComputation(item)
    }));
  }, [data]);
  
  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.processed}</div>
      ))}
    </div>
  );
}));
```

### Lazy Loading

```javascript
import { lazy, Suspense } from 'refract';

const LazyComponent = lazy(() => import('./HeavyComponent'));

const App = createComponent(({ lens }) => {
  return (
    <div>
      <h1>My App</h1>
      <Suspense fallback={<div>Loading heavy component...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
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
  localStorage.setItem('name', name); // Side effect!
  return <h1>Hello, {name}!</h1>;
});
```

### 2. Use Descriptive Names
```javascript
// ✅ Good
const UserProfileCard = createComponent(({ lens, user }) => {
  // ...
});

// ❌ Bad
const Component1 = createComponent(({ lens, data }) => {
  // ...
});
```

### 3. Extract Complex Logic
```javascript
// ✅ Good - Logic extracted to custom optic
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
  if (!items.length) {
    return <div>No items to display</div>;
  }
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id || item.name}>
          {item.name || 'Unnamed item'}
        </li>
      ))}
    </ul>
  );
});
```

## Next Steps

Now that you understand components, learn about:
- **[Refractions](./refractions)** - Reactive state management
- **[Lenses](./lenses)** - Scoped access to reactive features
- **[Optics](./optics)** - Reusable logic patterns
