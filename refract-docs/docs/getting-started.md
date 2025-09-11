# Getting Started

Get up and running with Refract in just a few minutes. This guide will walk you through installation, project setup, and creating your first Refract application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- A modern code editor (VS Code recommended)

## Installation

### Create a New Project

The fastest way to get started is using the Refract CLI:

```bash
npx create-refract-app my-app
cd my-app
npm start
```

### Add to Existing Project

If you want to add Refract to an existing project:

```bash
npm install refract-js
# or
yarn add refract-js
```

## Project Structure

A typical Refract project structure looks like this:

```
my-refract-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── App.js
│   │   └── Counter.js
│   ├── optics/
│   │   └── useTheme.js
│   ├── styles/
│   │   └── main.css
│   └── index.js
├── refract.config.js
└── package.json
```

## Your First Component

Let's create a simple counter component to understand Refract's core concepts:

### 1. Create the Component

```javascript
// src/components/Counter.js
import { createComponent } from 'refract';

const Counter = createComponent(({ lens }) => {
  // Create a reactive state using useRefraction
  const count = lens.useRefraction(0);
  
  // Define event handlers
  const increment = () => count.set(count.value + 1);
  const decrement = () => count.set(count.value - 1);
  const reset = () => count.set(0);

  return (
    <div className="counter">
      <h2>Counter: {count.value}</h2>
      <div className="buttons">
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
});

export default Counter;
```

### 2. Create the Main App

```javascript
// src/components/App.js
import { createComponent } from 'refract';
import Counter from './Counter';

const App = createComponent(() => {
  return (
    <div className="app">
      <h1>Welcome to Refract!</h1>
      <Counter />
    </div>
  );
});

export default App;
```

### 3. Mount the Application

```javascript
// src/index.js
import { createApp } from 'refract';
import App from './components/App';
import './styles/main.css';

// Create and mount the application
createApp(App).mount('#root');
```

### 4. Add Some Styling

```css
/* src/styles/main.css */
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.counter {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.counter h2 {
  margin: 0 0 1rem 0;
  color: #333;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.buttons button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #667eea;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

.buttons button:hover {
  background: #5a67d8;
}
```

## Understanding the Code

Let's break down what's happening in our counter example:

### Refractions
```javascript
const count = lens.useRefraction(0);
```
- Creates a reactive state variable initialized with `0`
- Automatically updates the UI when the value changes
- Access the current value with `count.value`
- Update the value with `count.set(newValue)`

### Lenses
```javascript
createComponent(({ lens }) => {
  // lens provides access to reactive hooks and effects
});
```
- The `lens` parameter gives you access to Refract's reactive system
- Use `lens.useRefraction()` for local component state
- Use `lens.useEffect()` for side effects
- Use `lens.useOptic()` for reusable logic

### Components
```javascript
const Counter = createComponent(({ lens }) => {
  // Component logic here
  return <JSX />;
});
```
- Components are pure functions that return JSX
- Created using the `createComponent()` function
- Receive props and lens as parameters

## Development Server

Start the development server to see your application in action:

```bash
npm start
```

Your application will be available at `http://localhost:3000` with hot reloading enabled.

## Building for Production

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Next Steps

Now that you have a basic Refract application running:

1. **[Learn Core Concepts](./concepts/components)** - Dive deeper into components, refractions, and lenses
2. **[Explore the API](./api/overview)** - Comprehensive API reference
3. **[Follow Tutorials](./tutorials/counter-app)** - Build more complex applications
4. **[Join the Community](https://discord.gg/refract)** - Get help and share your projects

## Common Issues

### Module Not Found
If you see module resolution errors, ensure your `refract.config.js` is properly configured:

```javascript
// refract.config.js
export default {
  resolve: {
    alias: {
      '@': './src'
    }
  }
};
```

### Hot Reloading Not Working
Make sure your development server is running on the correct port and your firewall isn't blocking the connection.

### Performance Issues
Refract is optimized by default, but for large applications, consider:
- Using `memo()` for expensive computations
- Implementing proper key props for lists
- Avoiding unnecessary re-renders with `useOptic()`

Ready to build something amazing? Let's continue with the [Core Concepts](./concepts/components)! 🚀
