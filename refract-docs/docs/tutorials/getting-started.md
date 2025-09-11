---
id: getting-started
title: Getting Started
---

# Getting Started with Refract

Welcome to Refract! This guide will help you set up your first Refract application and understand its core concepts.

## Prerequisites

- Node.js 16.14.0 or later
- npm or yarn package manager
- Basic knowledge of React and JavaScript

## Installation

Create a new Refract project using the following command:

```bash
npx create-refract-app my-app
cd my-app
npm start
```

## Project Structure

A typical Refract project structure looks like this:

```
my-app/
├── src/
│   ├── components/     # Your components
│   ├── pages/          # Page components
│   ├── App.js          # Main application component
│   └── index.js        # Application entry point
├── public/             # Static files
└── package.json
```

## Your First Component

Create a simple counter component in `src/components/Counter.js`:

```jsx
import { createComponent, useRefraction } from 'refract';

const Counter = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  
  const increment = () => count.value++;
  const decrement = () => count.value--;
  
  return (
    <div>
      <h2>Counter: {count.value}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
});

export default Counter;
```

## State Management

Refract provides a powerful state management system. Here's how to use it:

```jsx
// In a parent component
const [state, setState] = useRefraction({
  user: {
    name: 'John',
    preferences: { theme: 'light' }
  }
});

// Update state
setState(prev => ({
  ...prev,
  user: {
    ...prev.user,
    name: 'Jane'
  }
}));
```

## Next Steps

- Learn about [Components](../concepts/components)
- Explore [State Management](../concepts/state-management)
- Check out [Advanced Patterns](../advanced/performance)
