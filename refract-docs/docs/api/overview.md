# API Reference Overview

This section provides comprehensive documentation for all Refract APIs, including core functions, hooks, utilities, and configuration options. Each API is documented with detailed descriptions, parameters, return values, and practical examples.

## Core APIs

### Application Management
- **[createApp](./createApp)** - Initialize and configure a Refract application
- **[mount](./createApp#mount)** - Mount the application to a DOM element

### Component System
- **[createComponent](./createComponent)** - Create reactive components
- **[memo](./createComponent#memo)** - Optimize component re-rendering
- **[lazy](./createComponent#lazy)** - Code-split components for better performance

### State Management
- **[useRefraction](./useRefraction)** - Create reactive state variables
- **[createRefraction](./useRefraction#global-refractions)** - Create global reactive state
- **[useDerived](./useRefraction#derived-state)** - Create computed reactive values

### Effects and Lifecycle
- **[useEffect](./useEffect)** - Handle side effects and lifecycle events
- **[useFlash](./useFlash)** - Execute effects after render for animations
- **[useOptic](./useOptic)** - Create and use reusable logic patterns

### Lens System
- **[useLens](./useLens)** - Access component-scoped reactive features
- **[batch](./useLens#batching)** - Optimize multiple state updates

## Quick Reference

### Import Statements

```javascript
// Core functions
import { 
  createApp, 
  createComponent, 
  createRefraction 
} from 'refract';

// Hooks (used within components via lens)
import { 
  useRefraction, 
  useEffect, 
  useOptic, 
  useFlash 
} from 'refract';

// Utilities
import { 
  memo, 
  lazy, 
  Suspense 
} from 'refract';
```

### Basic Usage Patterns

#### Creating an Application
```javascript
import { createApp } from 'refract';
import App from './App';

createApp(App).mount('#root');
```

#### Creating a Component
```javascript
import { createComponent } from 'refract';

const MyComponent = createComponent(({ lens, ...props }) => {
  const state = lens.useRefraction(initialValue);
  
  lens.useEffect(() => {
    // Side effects here
  }, [dependencies]);
  
  return <JSX />;
});
```

#### Managing State
```javascript
// Local state
const count = lens.useRefraction(0);

// Global state
import { createRefraction } from 'refract';
export const globalState = createRefraction(initialValue);

// Derived state
const doubled = lens.useDerived(() => count.value * 2, [count]);
```

#### Handling Effects
```javascript
// Mount effect
lens.useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounting');
}, []);

// Update effect
lens.useEffect(() => {
  console.log('Value changed:', value);
}, [value]);

// Flash effect (after render)
lens.useFlash(() => {
  animateElement();
}, [trigger]);
```

## API Categories

### 🏗️ **Application & Components**
Functions for creating and managing applications and components.

| API | Description | Use Case |
|-----|-------------|----------|
| `createApp()` | Initialize application | App setup |
| `createComponent()` | Create reactive component | Component definition |
| `memo()` | Memoize component | Performance optimization |
| `lazy()` | Lazy load component | Code splitting |

### 🔄 **State Management**
APIs for managing reactive state and computed values.

| API | Description | Use Case |
|-----|-------------|----------|
| `useRefraction()` | Create reactive state | Local component state |
| `createRefraction()` | Create global state | Shared state |
| `useDerived()` | Computed values | Derived state |
| `batch()` | Batch updates | Performance |

### ⚡ **Effects & Lifecycle**
Functions for handling side effects and component lifecycle.

| API | Description | Use Case |
|-----|-------------|----------|
| `useEffect()` | Side effects | Data fetching, subscriptions |
| `useFlash()` | Post-render effects | Animations, DOM manipulation |
| `useOptic()` | Reusable logic | Custom hooks |

### 🔍 **Lens System**
The lens provides scoped access to reactive features within components.

| API | Description | Use Case |
|-----|-------------|----------|
| `lens.useRefraction()` | Scoped state | Component state |
| `lens.useEffect()` | Scoped effects | Component effects |
| `lens.useOptic()` | Scoped optics | Component logic |
| `lens.batch()` | Scoped batching | Component updates |

## Type Definitions

### Core Types

```typescript
// Component definition
type Component<P = {}> = (props: P & { lens: Lens }) => JSX.Element;

// Refraction (reactive state)
interface Refraction<T> {
  value: T;
  set: (value: T | ((prev: T) => T)) => void;
  subscribe: (callback: (value: T) => void) => () => void;
}

// Lens interface
interface Lens {
  useRefraction<T>(initialValue: T): Refraction<T>;
  useDerived<T>(compute: () => T, deps: any[]): Refraction<T>;
  useEffect(effect: () => void | (() => void), deps?: any[]): void;
  useFlash(effect: () => void, deps?: any[]): void;
  useOptic<T>(optic: () => T, deps: any[]): T;
  batch(fn: () => void): void;
}

// Application instance
interface App {
  mount(selector: string | Element): void;
  unmount(): void;
}
```

### Effect Types

```typescript
// Effect function
type EffectFunction = () => void | (() => void);

// Effect dependencies
type EffectDeps = any[] | undefined;

// Flash effect (no cleanup)
type FlashFunction = () => void;
```

### Optic Types

```typescript
// Optic function
type OpticFunction<T> = () => T;

// Optic dependencies
type OpticDeps = any[];
```

## Error Handling

### Common Error Patterns

```javascript
// Safe async effects
lens.useEffect(() => {
  let cancelled = false;
  
  fetchData()
    .then(data => {
      if (!cancelled) {
        setState(data);
      }
    })
    .catch(error => {
      if (!cancelled) {
        setError(error.message);
      }
    });
  
  return () => {
    cancelled = true;
  };
}, []);

// Error boundaries
const ErrorBoundary = createComponent(({ lens, children }) => {
  const hasError = lens.useRefraction(false);
  const error = lens.useRefraction(null);
  
  if (hasError.value) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <p>{error.value?.message}</p>
        <button onClick={() => hasError.set(false)}>
          Try again
        </button>
      </div>
    );
  }
  
  return children;
});
```

## Performance Guidelines

### Optimization Strategies

1. **Use `memo()` for expensive components**
   ```javascript
   const ExpensiveComponent = memo(createComponent(({ lens, data }) => {
     // Expensive rendering logic
   }));
   ```

2. **Batch related state updates**
   ```javascript
   lens.batch(() => {
     setState1(value1);
     setState2(value2);
     setState3(value3);
   });
   ```

3. **Use specific effect dependencies**
   ```javascript
   // ✅ Good - specific dependencies
   lens.useEffect(() => {
     fetchUser(userId);
   }, [userId]);
   
   // ❌ Bad - too broad
   lens.useEffect(() => {
     fetchUser(userId);
   }, [user]); // Runs when any user property changes
   ```

4. **Lazy load components**
   ```javascript
   const LazyComponent = lazy(() => import('./HeavyComponent'));
   
   <Suspense fallback={<Loading />}>
     <LazyComponent />
   </Suspense>
   ```

## Migration Guide

### From React

| React | Refract | Notes |
|-------|---------|-------|
| `useState` | `lens.useRefraction` | Similar API, automatic reactivity |
| `useEffect` | `lens.useEffect` | Same dependency system |
| `useMemo` | `lens.useDerived` | Reactive computed values |
| `useCallback` | `lens.useOptic` | For reusable logic |
| `React.memo` | `memo` | Same optimization concept |
| `React.lazy` | `lazy` | Same code splitting |

### Key Differences

1. **No `setState` needed** - Refractions update automatically
2. **Lens system** - Scoped access to reactive features
3. **Built-in reactivity** - No manual dependency tracking
4. **Optics** - More powerful than custom hooks

## Next Steps

- **[createApp](./createApp)** - Learn about application setup
- **[createComponent](./createComponent)** - Dive into component creation
- **[useRefraction](./useRefraction)** - Master state management
- **[useEffect](./useEffect)** - Handle side effects effectively
