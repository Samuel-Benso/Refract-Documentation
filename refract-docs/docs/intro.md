# Welcome to Refract

**Refract** is a JavaScript framework that makes building web apps easier. It helps you create apps that automatically update when your data changes. Refract uses special tools called **refractions**, **lenses**, and **optics** to help you build apps that are easy to maintain and grow.

## Why Choose Refract?

### **Reactive by Nature**
Your app updates automatically when data changes. No need to manually tell parts of your app to refresh - Refract handles this for you.

### **Build with Reusable Pieces**
Create logic once and use it everywhere. Refract's optics and lenses help you build components that are easy to test and maintain.

### **Familiar Yet Fresh**
If you know React, you'll feel right at home. Refract uses similar concepts but makes them even easier to work with.

### **Fast Performance**
Only the parts of your app that actually need to update will re-render. This means your app stays fast even as it grows.

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

Ready to start building with Refract? Let's get started!
