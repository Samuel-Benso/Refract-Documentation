---
slug: introducing-refract
title: Introducing Refract - A New Era of Reactive UI Development
authors:
  - name: Refract Team
    title: Core Development Team
    url: https://github.com/refract-js
    image_url: /img/logo.svg
tags: [announcement, reactive, javascript, ui]
---

# Introducing Refract: A New Era of Reactive UI Development

Today, we're excited to announce **Refract**, a revolutionary JavaScript framework that brings reactive programming to the forefront of UI development. Inspired by the physics of light refraction, Refract bends traditional paradigms to create more intuitive, performant, and maintainable applications.

<!--truncate-->

## The Problem with Current Frameworks

Modern web development has made tremendous strides, but we still face fundamental challenges:

- **Complex State Management**: Managing application state across components remains difficult
- **Performance Bottlenecks**: Unnecessary re-renders and inefficient updates slow down applications
- **Developer Experience**: Steep learning curves and verbose APIs hinder productivity
- **Composition Challenges**: Reusing logic across components often leads to complex patterns

## Enter Refract: Bending Light, Bending Reality

Refract addresses these challenges through a unique approach to reactive programming. Just as light bends when passing through different mediums, Refract allows your application state to flow and transform naturally through your component tree.

### Core Innovations

#### 1. Refractions - Reactive State Containers

```javascript
import { createComponent } from 'refract-js';

const Counter = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  
  return (
    <div>
      <h1>Count: {count.value}</h1>
      <button onClick={() => count.set(count.value + 1)}>
        Increment
      </button>
    </div>
  );
});
```

Refractions provide automatic dependency tracking and fine-grained updates, ensuring your UI stays in sync with minimal overhead.

#### 2. Lenses - Scoped Framework Access

Lenses provide scoped access to framework features, ensuring clean component boundaries and predictable behavior:

```javascript
const MyComponent = createComponent(({ lens, initialData }) => {
  const data = lens.useRefraction(initialData);
  const derived = lens.useDerived(() => data.value.length, [data.value]);
  
  lens.useEffect(() => {
    console.log('Data changed:', data.value);
  }, [data.value]);
  
  return <div>Items: {derived.value}</div>;
});
```

#### 3. Optics - Reusable Logic Units

Optics encapsulate stateful behavior that can be shared across components:

```javascript
const useCounter = lens.useOptic((initialValue = 0) => {
  const count = lens.useRefraction(initialValue);
  const increment = () => count.set(prev => prev + 1);
  const decrement = () => count.set(prev => prev - 1);
  const reset = () => count.set(initialValue);
  
  return { count: count.value, increment, decrement, reset };
});
```

## Performance That Scales

Refract's reactive system ensures optimal performance through:

- **Automatic Dependency Tracking**: Only components that depend on changed state re-render
- **Batched Updates**: Multiple state changes are batched into single render cycles
- **Intelligent Memoization**: Derived values are cached and only recalculated when dependencies change
- **Minimal Bundle Size**: Tree-shakeable architecture keeps your bundles lean

## Developer Experience First

We've designed Refract with developer productivity in mind:

- **Intuitive APIs**: Natural, readable code that expresses intent clearly
- **Excellent TypeScript Support**: Full type safety with intelligent inference
- **Comprehensive DevTools**: Debug reactive flows with visual state inspection
- **Rich Ecosystem**: Growing collection of utilities, patterns, and integrations

## Real-World Example: Todo Application

Here's how a complete todo application looks in Refract:

```javascript
const TodoApp = createComponent(({ lens }) => {
  const todos = lens.useRefraction([]);
  const filter = lens.useRefraction('all');
  const newTodo = lens.useRefraction('');

  const addTodo = () => {
    if (newTodo.value.trim()) {
      todos.set(prev => [...prev, {
        id: Date.now(),
        text: newTodo.value,
        completed: false
      }]);
      newTodo.set('');
    }
  };

  const toggleTodo = (id) => {
    todos.set(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const filteredTodos = lens.useDerived(() => {
    return todos.value.filter(todo => {
      if (filter.value === 'active') return !todo.completed;
      if (filter.value === 'completed') return todo.completed;
      return true;
    });
  }, [todos.value, filter.value]);

  return (
    <div className="todo-app">
      <header>
        <h1>Todos</h1>
        <input
          value={newTodo.value}
          onChange={(e) => newTodo.set(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
        />
      </header>
      
      <main>
        <TodoList todos={filteredTodos.value} onToggle={toggleTodo} />
        <TodoFilters filter={filter} />
      </main>
    </div>
  );
});
```

## What's Next?

This is just the beginning. We're working on:

- **Server-Side Rendering**: Full SSR support with hydration
- **React Integration**: Gradual migration path from React applications  
- **Mobile Development**: React Native integration for cross-platform apps
- **Advanced DevTools**: Time-travel debugging and performance profiling
- **Ecosystem Growth**: UI libraries, routing solutions, and state management patterns

## Get Started Today

Ready to experience the future of reactive UI development?

```bash
# Create a new Refract app
npx create-refract-app my-app
cd my-app
npm start

# Or add to existing project
npm install refract-js
```

Visit our [documentation](https://refract-docs.netlify.app) for comprehensive guides, tutorials, and API references.

## Join the Community

- 🌟 [Star us on GitHub](https://github.com/refract-js/refract)
- 💬 [Join our Discord](https://discord.gg/refract)
- 🐦 [Follow us on Twitter](https://twitter.com/RefractJS)
- 📧 [Subscribe to our newsletter](https://refract-js.org/newsletter)

The future of UI development is reactive, composable, and performant. Welcome to Refract - where light bends, and possibilities are infinite.

---

*The Refract Team*
