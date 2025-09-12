---
id: state-management
title: State Management in Refract
---

# State Management

Refract provides a flexible and efficient state management system that works seamlessly with React components. This guide covers the core concepts and patterns for managing state in Refract applications.

## Core Concepts

### 1. Local Component State

Use `useRefraction` hook for local component state:

```jsx
import { createComponent, useRefraction } from 'refract';

const Counter = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  
  return (
    <div>
      <p>Count: {count.value}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
});
```

### 2. Global State

Create global state using `createRefraction`:

```jsx
// store.js
import { createRefraction } from 'refract';

export const store = createRefraction({
  user: null,
  theme: 'light',
  preferences: {}
});

// In your component
const { user, theme } = store.value;
```

## State Updates

### Basic Updates

```jsx
// Direct mutation (simplest)
count.value += 1;

// Using setter function (functional update)
count.set(prev => prev + 1);
```

### Batching Updates

```jsx
import { batch } from 'refract';

// Multiple state updates in a single render
batch(() => {
  user.value = { ...user.value, name: 'John' };
  theme.value = 'dark';
});
```

## State Composition

### Derived State

```jsx
const fullName = useDerived(
  () => `${firstName.value} ${lastName.value}`,
  [firstName, lastName]
);
```

### State Selectors

```jsx
const userName = useRefraction(
  () => store.value.user?.name,
  [store]
);
```

## Best Practices

1. **Colocate State**: Keep state as close to where it's used as possible
2. **Lift State Up**: When multiple components need the same state
3. **Use Context for Global State**: For app-wide state that many components need
4. **Memoize Expensive Computations**: Use `useMemo` for derived state
5. **Batch Updates**: Group related state updates together

## Advanced Patterns

### State Machines

```jsx
const [state, send] = useMachine({
  initial: 'idle',
  states: {
    idle: {
      on: { FETCH: 'loading' }
    },
    loading: {
      on: {
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    // ...
  }
});
```

### Middleware

```jsx
const app = createApp(App, {
  middleware: [
    logger,
    devTools,
    persistState('app-state')
  ]
});
```

## Related

- [Components](./components)
- [Effects](./effects)
- [Performance Optimization](../advanced/performance)
