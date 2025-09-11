# Welcome to Refract

**Refract** is a modern, reactive JavaScript framework that brings clarity and composability to UI development. Built with developer experience in mind, Refract introduces innovative concepts like **refractions**, **lenses**, and **optics** to create maintainable, scalable applications.

## Why Choose Refract?

### 🚀 **Reactive by Nature**
State changes automatically propagate through your application without manual intervention. No more `setState` calls or complex state management libraries.

### 🔧 **Composable Architecture**
Build reusable logic with optics and lenses. Create modular components that can be easily tested and maintained.

### 💡 **Familiar Yet Fresh**
If you know React, you'll feel at home with Refract's component model, while enjoying modern reactive programming patterns.

### ⚡ **Performance Optimized**
Fine-grained reactivity ensures only the components that need updates are re-rendered, leading to excellent performance out of the box.

## Quick Example

```javascript
import { createApp, createComponent } from 'refract';

const TodoApp = createComponent(({ lens }) => {
  const todos = lens.useRefraction([]);
  const input = lens.useRefraction('');

  const addTodo = () => {
    if (input.value.trim()) {
      todos.set([...todos.value, { 
        id: Date.now(), 
        text: input.value, 
        completed: false 
      }]);
      input.set('');
    }
  };

  return (
    <div>
      <h1>My Todos</h1>
      <input 
        value={input.value}
        onChange={(e) => input.set(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>
      
      <ul>
        {todos.value.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
});

createApp(TodoApp).mount('#root');
```

## What's Next?

- **[Getting Started](./getting-started)** - Set up your first Refract application
- **[Core Concepts](./concepts/components)** - Learn about components, refractions, and lenses
- **[API Reference](./api/overview)** - Comprehensive API documentation
- **[Tutorials](./tutorials/counter-app)** - Step-by-step guides and examples

Ready to refract your development experience? Let's get started! 🌟
