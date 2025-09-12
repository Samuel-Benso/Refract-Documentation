# Building a Counter App

In this tutorial, you'll build a complete counter application using Refract. This hands-on guide will teach you the fundamentals of Refract development, including state management, effects, and component composition.

## What You'll Build

By the end of this tutorial, you'll have created:
- A counter with increment/decrement functionality
- Step size customization
- Reset functionality
- Persistence using localStorage
- Animation effects
- Multiple counter instances

## Prerequisites

- Basic knowledge of JavaScript and React concepts
- Node.js installed on your system
- A code editor (VS Code recommended)

## Project Setup

### 1. Create a New Project

```bash
npx create-refract-app counter-tutorial
cd counter-tutorial
npm start
```

### 2. Project Structure

Your project should have this structure:

```
counter-tutorial/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── styles/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Step 1: Basic Counter Component

Let's start with a simple counter component.

### Create the Counter Component

```javascript
// src/components/Counter.js
import { createComponent } from 'refract';

const Counter = createComponent(({ lens, initialValue = 0 }) => {
  const count = lens.useRefraction(initialValue);
  
  const increment = () => count.set(count.value + 1);
  const decrement = () => count.set(count.value - 1);
  const reset = () => count.set(initialValue);
  
  return (
    <div className="counter">
      <h2>Counter</h2>
      <div className="counter-display">
        <span className="count-value">{count.value}</span>
      </div>
      <div className="counter-controls">
        <button onClick={decrement} className="btn btn-secondary">
          -
        </button>
        <button onClick={reset} className="btn btn-outline">
          Reset
        </button>
        <button onClick={increment} className="btn btn-primary">
          +
        </button>
      </div>
    </div>
  );
});

export default Counter;
```

### Add Basic Styling

```css
/* src/styles/Counter.css */
.counter {
  max-width: 300px;
  margin: 2rem auto;
  padding: 2rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  text-align: center;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.counter h2 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.counter-display {
  margin: 2rem 0;
}

.count-value {
  font-size: 3rem;
  font-weight: bold;
  color: #4a5568;
  font-family: 'Courier New', monospace;
}

.counter-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
}

.btn-primary {
  background: #4299e1;
  color: white;
}

.btn-primary:hover {
  background: #3182ce;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-outline:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}
```

### Update App Component

```javascript
// src/App.js
import { createComponent } from 'refract';
import Counter from './components/Counter';
import './styles/Counter.css';

const App = createComponent(({ lens }) => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Refract Counter Tutorial</h1>
        <p>Learn Refract by building a counter app</p>
      </header>
      
      <main>
        <Counter initialValue={0} />
      </main>
    </div>
  );
});

export default App;
```

### Add App Styling

```css
/* src/styles/App.css */
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.app-header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.app-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.app-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}
```

## Step 2: Enhanced Counter with Step Size

Let's add the ability to customize the step size.

```javascript
// src/components/EnhancedCounter.js
import { createComponent } from 'refract';

const EnhancedCounter = createComponent(({ lens, initialValue = 0, initialStep = 1 }) => {
  const count = lens.useRefraction(initialValue);
  const step = lens.useRefraction(initialStep);
  
  const increment = () => count.set(count.value + step.value);
  const decrement = () => count.set(count.value - step.value);
  const reset = () => count.set(initialValue);
  
  const handleStepChange = (e) => {
    const newStep = parseInt(e.target.value) || 1;
    step.set(newStep);
  };
  
  return (
    <div className="counter enhanced-counter">
      <h2>Enhanced Counter</h2>
      
      <div className="step-control">
        <label htmlFor="step-input">Step Size:</label>
        <input
          id="step-input"
          type="number"
          value={step.value}
          onChange={handleStepChange}
          min="1"
          max="100"
          className="step-input"
        />
      </div>
      
      <div className="counter-display">
        <span className="count-value">{count.value}</span>
      </div>
      
      <div className="counter-controls">
        <button onClick={decrement} className="btn btn-secondary">
          -{step.value}
        </button>
        <button onClick={reset} className="btn btn-outline">
          Reset
        </button>
        <button onClick={increment} className="btn btn-primary">
          +{step.value}
        </button>
      </div>
    </div>
  );
});

export default EnhancedCounter;
```

### Add Enhanced Styling

```css
/* Add to src/styles/Counter.css */
.enhanced-counter {
  max-width: 350px;
}

.step-control {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.step-control label {
  font-weight: 600;
  color: #4a5568;
}

.step-input {
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
}

.step-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}
```

## Step 3: Persistent Counter with localStorage

Add persistence so the counter value survives page refreshes.

```javascript
// src/components/PersistentCounter.js
import { createComponent } from 'refract';

const PersistentCounter = createComponent(({ lens, storageKey = 'counter' }) => {
  // Initialize from localStorage or default to 0
  const getStoredValue = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? parseInt(stored) : 0;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return 0;
    }
  };
  
  const count = lens.useRefraction(getStoredValue());
  const step = lens.useRefraction(1);
  
  // Save to localStorage whenever count changes
  lens.useEffect(() => {
    try {
      localStorage.setItem(storageKey, count.value.toString());
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, [count.value, storageKey]);
  
  const increment = () => count.set(count.value + step.value);
  const decrement = () => count.set(count.value - step.value);
  const reset = () => count.set(0);
  
  const clearStorage = () => {
    try {
      localStorage.removeItem(storageKey);
      count.set(0);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  };
  
  return (
    <div className="counter persistent-counter">
      <h2>Persistent Counter</h2>
      <p className="storage-info">
        Saved as: <code>{storageKey}</code>
      </p>
      
      <div className="step-control">
        <label htmlFor="step-input">Step Size:</label>
        <input
          id="step-input"
          type="number"
          value={step.value}
          onChange={(e) => step.set(parseInt(e.target.value) || 1)}
          min="1"
          max="100"
          className="step-input"
        />
      </div>
      
      <div className="counter-display">
        <span className="count-value">{count.value}</span>
      </div>
      
      <div className="counter-controls">
        <button onClick={decrement} className="btn btn-secondary">
          -{step.value}
        </button>
        <button onClick={reset} className="btn btn-outline">
          Reset
        </button>
        <button onClick={increment} className="btn btn-primary">
          +{step.value}
        </button>
      </div>
      
      <div className="storage-controls">
        <button onClick={clearStorage} className="btn btn-danger">
          Clear Storage
        </button>
      </div>
    </div>
  );
});

export default PersistentCounter;
```

### Add Persistent Counter Styling

```css
/* Add to src/styles/Counter.css */
.persistent-counter {
  max-width: 400px;
}

.storage-info {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1rem;
  text-align: center;
}

.storage-info code {
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.storage-controls {
  margin-top: 1rem;
  text-align: center;
}

.btn-danger {
  background: #f56565;
  color: white;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.btn-danger:hover {
  background: #e53e3e;
  transform: translateY(-1px);
}
```

## Step 4: Animated Counter

Add smooth animations to make the counter more engaging.

```javascript
// src/components/AnimatedCounter.js
import { createComponent } from 'refract';

const AnimatedCounter = createComponent(({ lens }) => {
  const count = lens.useRefraction(0);
  const displayCount = lens.useRefraction(0);
  const isAnimating = lens.useRefraction(false);
  const step = lens.useRefraction(1);
  
  // Animate count changes
  lens.useEffect(() => {
    if (count.value === displayCount.value) return;
    
    isAnimating.set(true);
    const startValue = displayCount.value;
    const endValue = count.value;
    const duration = 300;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOut);
      
      displayCount.set(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isAnimating.set(false);
      }
    };
    
    requestAnimationFrame(animate);
  }, [count.value]);
  
  // Flash effect for button clicks
  const buttonRef = lens.useRefraction(null);
  const flashTrigger = lens.useRefraction(0);
  
  lens.useFlash(() => {
    if (buttonRef.value && flashTrigger.value > 0) {
      buttonRef.value.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (buttonRef.value) {
          buttonRef.value.style.transform = 'scale(1)';
        }
      }, 100);
    }
  }, [flashTrigger.value]);
  
  const increment = () => {
    count.set(count.value + step.value);
    flashTrigger.set(prev => prev + 1);
  };
  
  const decrement = () => {
    count.set(count.value - step.value);
    flashTrigger.set(prev => prev + 1);
  };
  
  const reset = () => {
    count.set(0);
    flashTrigger.set(prev => prev + 1);
  };
  
  return (
    <div className="counter animated-counter">
      <h2>Animated Counter</h2>
      
      <div className="step-control">
        <label htmlFor="step-input">Step Size:</label>
        <input
          id="step-input"
          type="number"
          value={step.value}
          onChange={(e) => step.set(parseInt(e.target.value) || 1)}
          min="1"
          max="100"
          className="step-input"
        />
      </div>
      
      <div className="counter-display">
        <span 
          className={`count-value ${isAnimating.value ? 'animating' : ''}`}
        >
          {displayCount.value}
        </span>
      </div>
      
      <div className="counter-controls" ref={(el) => buttonRef.set(el)}>
        <button onClick={decrement} className="btn btn-secondary">
          -{step.value}
        </button>
        <button onClick={reset} className="btn btn-outline">
          Reset
        </button>
        <button onClick={increment} className="btn btn-primary">
          +{step.value}
        </button>
      </div>
      
      {isAnimating.value && (
        <div className="animation-indicator">
          Animating...
        </div>
      )}
    </div>
  );
});

export default AnimatedCounter;
```

### Add Animation Styling

```css
/* Add to src/styles/Counter.css */
.animated-counter .count-value {
  transition: color 0.3s ease;
}

.animated-counter .count-value.animating {
  color: #4299e1;
}

.counter-controls {
  transition: transform 0.1s ease;
}

.animation-indicator {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #4299e1;
  font-style: italic;
}

/* Button hover animations */
.btn {
  transition: all 0.2s ease;
}

.btn:active {
  transform: translateY(1px);
}
```

## Step 5: Multiple Counter Manager

Create a component that manages multiple counter instances.

```javascript
// src/components/CounterManager.js
import { createComponent } from 'refract';
import PersistentCounter from './PersistentCounter';

const CounterManager = createComponent(({ lens }) => {
  const counters = lens.useRefraction([
    { id: 1, name: 'Counter A', storageKey: 'counter-a' },
    { id: 2, name: 'Counter B', storageKey: 'counter-b' }
  ]);
  
  const newCounterName = lens.useRefraction('');
  
  const addCounter = () => {
    if (!newCounterName.value.trim()) return;
    
    const newCounter = {
      id: Date.now(),
      name: newCounterName.value,
      storageKey: `counter-${Date.now()}`
    };
    
    counters.set(prev => [...prev, newCounter]);
    newCounterName.set('');
  };
  
  const removeCounter = (id) => {
    counters.set(prev => prev.filter(counter => counter.id !== id));
  };
  
  const totalCount = lens.useDerived(() => {
    return counters.value.reduce((total, counter) => {
      try {
        const stored = localStorage.getItem(counter.storageKey);
        return total + (stored ? parseInt(stored) : 0);
      } catch {
        return total;
      }
    }, 0);
  }, [counters.value]);
  
  return (
    <div className="counter-manager">
      <h1>Counter Manager</h1>
      
      <div className="manager-stats">
        <p>Total Counters: {counters.value.length}</p>
        <p>Combined Total: {totalCount.value}</p>
      </div>
      
      <div className="add-counter">
        <input
          type="text"
          value={newCounterName.value}
          onChange={(e) => newCounterName.set(e.target.value)}
          placeholder="Enter counter name"
          className="counter-name-input"
          onKeyPress={(e) => e.key === 'Enter' && addCounter()}
        />
        <button onClick={addCounter} className="btn btn-primary">
          Add Counter
        </button>
      </div>
      
      <div className="counters-grid">
        {counters.value.map(counter => (
          <div key={counter.id} className="counter-wrapper">
            <div className="counter-header">
              <h3>{counter.name}</h3>
              <button 
                onClick={() => removeCounter(counter.id)}
                className="btn btn-danger btn-small"
                title="Remove counter"
              >
                ×
              </button>
            </div>
            <PersistentCounter storageKey={counter.storageKey} />
          </div>
        ))}
      </div>
    </div>
  );
});

export default CounterManager;
```

### Add Manager Styling

```css
/* Add to src/styles/Counter.css */
.counter-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.counter-manager h1 {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.manager-stats {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
  color: white;
}

.manager-stats p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.add-counter {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.counter-name-input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-width: 200px;
}

.counter-name-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.counters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.counter-wrapper {
  position: relative;
}

.counter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.counter-header h3 {
  color: white;
  margin: 0;
  font-size: 1.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 1.25rem;
  line-height: 1;
  min-width: auto;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
```

## Step 6: Final App Integration

Update your main App component to showcase all the counters.

```javascript
// src/App.js
import { createComponent } from 'refract';
import Counter from './components/Counter';
import EnhancedCounter from './components/EnhancedCounter';
import PersistentCounter from './components/PersistentCounter';
import AnimatedCounter from './components/AnimatedCounter';
import CounterManager from './components/CounterManager';
import './styles/App.css';
import './styles/Counter.css';

const App = createComponent(({ lens }) => {
  const currentView = lens.useRefraction('showcase');
  
  const views = {
    showcase: 'Counter Showcase',
    manager: 'Counter Manager'
  };
  
  const renderCurrentView = () => {
    switch (currentView.value) {
      case 'manager':
        return <CounterManager />;
      case 'showcase':
      default:
        return (
          <div className="showcase-grid">
            <Counter initialValue={0} />
            <EnhancedCounter initialValue={10} initialStep={5} />
            <PersistentCounter storageKey="demo-counter" />
            <AnimatedCounter />
          </div>
        );
    }
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>Refract Counter Tutorial</h1>
        <p>Learn Refract by building interactive counter components</p>
        
        <nav className="app-nav">
          {Object.entries(views).map(([key, label]) => (
            <button
              key={key}
              onClick={() => currentView.set(key)}
              className={`nav-btn ${currentView.value === key ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
});

export default App;
```

### Final App Styling

```css
/* Add to src/styles/App.css */
.app-nav {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.nav-btn.active {
  background: white;
  color: #4a5568;
  border-color: white;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
  
  .app-header h1 {
    font-size: 2rem;
  }
  
  .showcase-grid {
    grid-template-columns: 1fr;
  }
  
  .counters-grid {
    grid-template-columns: 1fr;
  }
  
  .app-nav {
    flex-direction: column;
    align-items: center;
  }
}
```

## What You've Learned

Congratulations! You've built a comprehensive counter application using Refract. Here's what you've learned:

### Core Concepts
- **Components**: Created reusable, reactive components with `createComponent`
- **State Management**: Used `lens.useRefraction` for reactive state
- **Effects**: Implemented side effects with `lens.useEffect`
- **Flash Effects**: Added animations with `lens.useFlash`
- **Derived State**: Computed values with `lens.useDerived`

### Advanced Patterns
- **Persistence**: Integrated with localStorage for data persistence
- **Animation**: Created smooth transitions and visual feedback
- **Composition**: Built complex UIs from simple components
- **State Synchronization**: Managed multiple related state values

### Best Practices
- Component isolation and reusability
- Proper effect cleanup and dependency management
- Performance optimization with batched updates
- Responsive design and accessibility considerations

## Next Steps

Now that you've mastered the basics, try these challenges:

1. **Add Keyboard Shortcuts**: Implement keyboard controls for increment/decrement
2. **Counter Themes**: Add different visual themes for counters
3. **Export/Import**: Allow users to save and load counter configurations
4. **Counter History**: Track and display the history of counter changes
5. **Real-time Sync**: Sync counters across multiple browser tabs

## Additional Resources

- [Refract API Reference](../api/overview)
- [Advanced Patterns](../advanced/performance)
- [Testing Guide](../advanced/testing)
- [Community Examples](https://github.com/refract-js/examples)
