---
slug: performance-optimization-guide
title: Mastering Performance in Refract - Advanced Optimization Techniques
authors:
  - name: Refract Team
    title: Core Development Team
    url: https://github.com/refract-js
    image_url: https://github.com/refract-js.png
tags: [performance, optimization, best-practices, advanced]
---

# Mastering Performance in Refract: Advanced Optimization Techniques

Performance is at the heart of great user experiences. While Refract provides excellent performance out of the box through its reactive architecture, understanding advanced optimization techniques can help you build lightning-fast applications that scale beautifully.

<!--truncate-->

## Understanding Refract's Performance Model

Refract's performance advantages come from several key architectural decisions:

- **Fine-grained reactivity**: Only components that depend on changed state re-render
- **Automatic batching**: Multiple state updates are batched into single render cycles
- **Intelligent memoization**: Derived values are cached and recomputed only when necessary
- **Minimal overhead**: Lightweight reactive primitives with minimal runtime cost

## Performance Measurement and Profiling

Before optimizing, you need to measure. Here's how to profile your Refract applications:

### Built-in Performance Monitoring

```javascript
import { createApp, enablePerformanceMonitoring } from 'refract-js';

// Enable performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  enablePerformanceMonitoring({
    logRefractionUpdates: true,
    logRenderTimes: true,
    trackMemoryUsage: true,
  });
}

const app = createApp();
```

### Custom Performance Hooks

```javascript
const usePerformanceTracker = createOptic((lens, componentName) => {
  const renderCount = lens.useRefraction(0);
  const lastRenderTime = lens.useRefraction(0);

  lens.useEffect(() => {
    const start = performance.now();
    renderCount.set(prev => prev + 1);
    
    return () => {
      const end = performance.now();
      lastRenderTime.set(end - start);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render #${renderCount.value}: ${end - start}ms`);
      }
    };
  });

  return {
    renderCount: renderCount.value,
    lastRenderTime: lastRenderTime.value,
  };
});
```

## Optimizing Refractions

### 1. Minimize Refraction Granularity

Instead of storing complex objects in single refractions, break them down:

```javascript
// ❌ Less optimal - entire object updates trigger all dependents
const user = lens.useRefraction({
  profile: { name: 'John', email: 'john@example.com' },
  preferences: { theme: 'dark', notifications: true },
  stats: { loginCount: 42, lastLogin: new Date() }
});

// ✅ Better - granular updates
const userProfile = lens.useRefraction({ name: 'John', email: 'john@example.com' });
const userPreferences = lens.useRefraction({ theme: 'dark', notifications: true });
const userStats = lens.useRefraction({ loginCount: 42, lastLogin: new Date() });
```

### 2. Use Derived Values Strategically

Derived values are cached and only recalculated when dependencies change:

```javascript
const TodoList = createComponent(({ lens, todos }) => {
  // ✅ Cached computation - only recalculates when todos change
  const todoStats = lens.useDerived(() => ({
    total: todos.value.length,
    completed: todos.value.filter(t => t.completed).length,
    active: todos.value.filter(t => !t.completed).length,
  }), [todos.value]);

  // ✅ Expensive filtering is cached
  const filteredTodos = lens.useDerived(() => {
    return todos.value
      .filter(todo => todo.text.toLowerCase().includes(searchTerm.value.toLowerCase()))
      .sort((a, b) => a.priority - b.priority);
  }, [todos.value, searchTerm.value]);

  return (
    <div>
      <TodoStats stats={todoStats.value} />
      <TodoItems items={filteredTodos.value} />
    </div>
  );
});
```

### 3. Batch State Updates

When making multiple related updates, batch them to prevent intermediate renders:

```javascript
const useOptimizedTodoActions = createOptic((lens, todos) => {
  const batchUpdateTodos = (updates) => {
    // Use a single state update for multiple changes
    todos.set(prevTodos => {
      let newTodos = [...prevTodos];
      
      updates.forEach(update => {
        switch (update.type) {
          case 'toggle':
            newTodos = newTodos.map(todo =>
              todo.id === update.id ? { ...todo, completed: !todo.completed } : todo
            );
            break;
          case 'delete':
            newTodos = newTodos.filter(todo => todo.id !== update.id);
            break;
          case 'add':
            newTodos.push(update.todo);
            break;
        }
      });
      
      return newTodos;
    });
  };

  const completeAll = () => {
    todos.set(prevTodos => 
      prevTodos.map(todo => ({ ...todo, completed: true }))
    );
  };

  return { batchUpdateTodos, completeAll };
});
```

## Component-Level Optimizations

### 1. Minimize Component Re-renders

Use component memoization for expensive renders:

```javascript
const ExpensiveChart = createComponent(({ lens, data, config }) => {
  // Only re-render when data or config actually changes
  const memoizedChart = lens.useDerived(() => {
    return generateChartData(data.value, config.value);
  }, [data.value, config.value]);

  // Expensive DOM operations only when necessary
  lens.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    renderChart(ctx, memoizedChart.value);
  }, [memoizedChart.value]);

  return <canvas ref={canvasRef} />;
});
```

### 2. Optimize List Rendering

For large lists, implement virtualization and efficient key strategies:

```javascript
const VirtualizedList = createComponent(({ lens, items, itemHeight = 50 }) => {
  const scrollTop = lens.useRefraction(0);
  const containerHeight = lens.useRefraction(400);

  const visibleItems = lens.useDerived(() => {
    const startIndex = Math.floor(scrollTop.value / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight.value / itemHeight) + 1,
      items.value.length
    );
    
    return items.value.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
    }));
  }, [scrollTop.value, containerHeight.value, items.value]);

  const totalHeight = items.value.length * itemHeight;
  const offsetY = Math.floor(scrollTop.value / itemHeight) * itemHeight;

  return (
    <div 
      style={{ height: containerHeight.value, overflow: 'auto' }}
      onScroll={(e) => scrollTop.set(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.value.map(item => (
            <ListItem 
              key={item.id} 
              item={item} 
              style={{ height: itemHeight }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
```

### 3. Lazy Loading and Code Splitting

Implement lazy loading for better initial load performance:

```javascript
const LazyRoute = createComponent(({ lens, path, component: Component }) => {
  const isLoaded = lens.useRefraction(false);
  const loadedComponent = lens.useRefraction(null);

  lens.useEffect(() => {
    if (path === currentPath.value && !isLoaded.value) {
      Component().then(module => {
        loadedComponent.set(module.default);
        isLoaded.set(true);
      });
    }
  }, [path, currentPath.value]);

  if (!isLoaded.value) {
    return <LoadingSpinner />;
  }

  const LoadedComponent = loadedComponent.value;
  return LoadedComponent ? <LoadedComponent lens={lens} /> : null;
});

// Usage
const routes = [
  { path: '/dashboard', component: () => import('./Dashboard') },
  { path: '/profile', component: () => import('./Profile') },
  { path: '/settings', component: () => import('./Settings') },
];
```

## Memory Management

### 1. Cleanup Effects Properly

Always clean up subscriptions and timers:

```javascript
const useWebSocketConnection = createOptic((lens, url) => {
  const connection = lens.useRefraction(null);
  const messages = lens.useRefraction([]);

  lens.useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onmessage = (event) => {
      messages.set(prev => [...prev, JSON.parse(event.data)]);
    };
    
    connection.set(ws);
    
    // Cleanup function
    return () => {
      ws.close();
      connection.set(null);
    };
  }, [url]);

  return {
    connection: connection.value,
    messages: messages.value,
  };
});
```

### 2. Avoid Memory Leaks in Derived Values

Be careful with closures in derived values:

```javascript
// ❌ Potential memory leak - captures entire component scope
const expensiveComputation = lens.useDerived(() => {
  return heavyProcessing(someData, anotherData, yetAnotherData);
}, [someData.value]);

// ✅ Better - only capture what's needed
const expensiveComputation = lens.useDerived(() => {
  const data = someData.value;
  return heavyProcessing(data);
}, [someData.value]);
```

## Advanced Patterns

### 1. Selective Updates with Lenses

Use lenses to update specific parts of complex state:

```javascript
const useSelectiveUpdates = createOptic((lens, initialState) => {
  const state = lens.useRefraction(initialState);

  const updatePath = (path, value) => {
    state.set(prevState => {
      const newState = { ...prevState };
      let current = newState;
      
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newState;
    });
  };

  return {
    state: state.value,
    updatePath,
  };
});
```

### 2. Debounced Updates

Implement debouncing for expensive operations:

```javascript
const useDebouncedSearch = createOptic((lens, delay = 300) => {
  const query = lens.useRefraction('');
  const debouncedQuery = lens.useRefraction('');
  const isSearching = lens.useRefraction(false);

  lens.useEffect(() => {
    const timer = setTimeout(() => {
      debouncedQuery.set(query.value);
      isSearching.set(false);
    }, delay);

    isSearching.set(true);

    return () => clearTimeout(timer);
  }, [query.value, delay]);

  return {
    query: query.value,
    debouncedQuery: debouncedQuery.value,
    isSearching: isSearching.value,
    setQuery: query.set,
  };
});
```

## Performance Monitoring in Production

### 1. Custom Metrics Collection

```javascript
const usePerformanceMetrics = createOptic((lens) => {
  const metrics = lens.useRefraction({
    renderCount: 0,
    averageRenderTime: 0,
    memoryUsage: 0,
  });

  const recordRender = (renderTime) => {
    metrics.set(prev => ({
      renderCount: prev.renderCount + 1,
      averageRenderTime: (prev.averageRenderTime * prev.renderCount + renderTime) / (prev.renderCount + 1),
      memoryUsage: performance.memory?.usedJSHeapSize || 0,
    }));
  };

  // Send metrics to analytics service
  lens.useEffect(() => {
    const interval = setInterval(() => {
      if (metrics.value.renderCount > 0) {
        analytics.track('performance_metrics', metrics.value);
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return { metrics: metrics.value, recordRender };
});
```

### 2. Performance Budgets

Set up performance budgets and alerts:

```javascript
const PERFORMANCE_BUDGETS = {
  maxRenderTime: 16, // 60fps
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  maxRefractionUpdates: 100, // per second
};

const usePerformanceBudget = createOptic((lens) => {
  const violations = lens.useRefraction([]);

  const checkBudget = (metric, value) => {
    const budget = PERFORMANCE_BUDGETS[metric];
    if (budget && value > budget) {
      violations.set(prev => [...prev, {
        metric,
        value,
        budget,
        timestamp: Date.now(),
      }]);

      // Alert in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Performance budget exceeded: ${metric} (${value} > ${budget})`);
      }
    }
  };

  return { violations: violations.value, checkBudget };
});
```

## Best Practices Summary

1. **Measure First**: Always profile before optimizing
2. **Granular State**: Break down complex state into smaller refractions
3. **Cache Expensive Operations**: Use derived values for computations
4. **Batch Updates**: Group related state changes
5. **Clean Up**: Always clean up effects and subscriptions
6. **Virtualize Large Lists**: Implement virtualization for performance
7. **Lazy Load**: Split code and load components on demand
8. **Monitor Production**: Track performance metrics in production

## Conclusion

Refract's reactive architecture provides excellent performance out of the box, but understanding these advanced optimization techniques will help you build applications that scale to millions of users while maintaining smooth, responsive user experiences.

Remember: premature optimization is the root of all evil. Focus on building great features first, then optimize based on real performance data and user feedback.

---

*Happy optimizing!*  
*The Refract Team*
