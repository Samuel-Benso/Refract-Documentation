# useFlash

The `useFlash` hook executes effects after the component has rendered and the DOM has been updated. It's specifically designed for operations that need to happen after the render cycle, such as animations, DOM measurements, and focus management.

## Syntax

```javascript
lens.useFlash(effect, dependencies?)
```

## Parameters

### `effect`
- **Type:** `() => void`
- **Required:** Yes
- **Description:** Function that contains post-render logic. Unlike `useEffect`, flash effects cannot return cleanup functions.

### `dependencies`
- **Type:** `any[] | undefined`
- **Required:** No
- **Description:** Array of values that the flash effect depends on. Effect re-runs when dependencies change.

## Return Value

Returns `void`. Flash effects do not support cleanup functions.

## Basic Usage

### DOM Manipulation

```javascript
const DOMManipulation = createComponent(({ lens }) => {
  const elementRef = lens.useRefraction(null);
  const isHighlighted = lens.useRefraction(false);
  
  // Flash effect runs after render
  lens.useFlash(() => {
    if (elementRef.value && isHighlighted.value) {
      elementRef.value.style.backgroundColor = 'yellow';
      elementRef.value.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isHighlighted.value]);
  
  return (
    <div>
      <button onClick={() => isHighlighted.set(!isHighlighted.value)}>
        Toggle Highlight
      </button>
      <div ref={(el) => elementRef.set(el)}>
        This element can be highlighted
      </div>
    </div>
  );
});
```

### Focus Management

```javascript
const FocusManagement = createComponent(({ lens }) => {
  const inputRef = lens.useRefraction(null);
  const shouldFocus = lens.useRefraction(false);
  
  lens.useFlash(() => {
    if (inputRef.value && shouldFocus.value) {
      inputRef.value.focus();
      inputRef.value.select();
    }
  }, [shouldFocus.value]);
  
  return (
    <div>
      <input 
        ref={(el) => inputRef.set(el)}
        placeholder="This input can be auto-focused"
      />
      <button onClick={() => shouldFocus.set(true)}>
        Focus Input
      </button>
    </div>
  );
});
```

## Animation Examples

### CSS Transitions

```javascript
const CSSTransition = createComponent(({ lens }) => {
  const elementRef = lens.useRefraction(null);
  const isVisible = lens.useRefraction(false);
  
  lens.useFlash(() => {
    if (elementRef.value) {
      if (isVisible.value) {
        // Trigger enter animation
        elementRef.value.style.opacity = '0';
        elementRef.value.style.transform = 'translateY(20px)';
        
        // Force reflow
        elementRef.value.offsetHeight;
        
        // Apply transition
        elementRef.value.style.transition = 'all 0.3s ease';
        elementRef.value.style.opacity = '1';
        elementRef.value.style.transform = 'translateY(0)';
      }
    }
  }, [isVisible.value]);
  
  return (
    <div>
      <button onClick={() => isVisible.set(!isVisible.value)}>
        Toggle Element
      </button>
      {isVisible.value && (
        <div ref={(el) => elementRef.set(el)} className="animated-element">
          Animated Content
        </div>
      )}
    </div>
  );
});
```

### JavaScript Animations

```javascript
const JSAnimation = createComponent(({ lens }) => {
  const elementRef = lens.useRefraction(null);
  const animationTrigger = lens.useRefraction(0);
  
  lens.useFlash(() => {
    if (elementRef.value && animationTrigger.value > 0) {
      const element = elementRef.value;
      const startTime = Date.now();
      const duration = 500;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // Apply animation
        element.style.transform = `scale(${1 + easeOut * 0.2})`;
        element.style.backgroundColor = `hsl(${progress * 360}, 70%, 50%)`;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Reset styles
          element.style.transform = 'scale(1)';
          element.style.backgroundColor = '';
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [animationTrigger.value]);
  
  return (
    <div>
      <div ref={(el) => elementRef.set(el)} className="js-animated">
        Click the button to animate me!
      </div>
      <button onClick={() => animationTrigger.set(prev => prev + 1)}>
        Animate
      </button>
    </div>
  );
});
```

## DOM Measurements

### Element Dimensions

```javascript
const ElementMeasurement = createComponent(({ lens }) => {
  const contentRef = lens.useRefraction(null);
  const dimensions = lens.useRefraction({ width: 0, height: 0 });
  const content = lens.useRefraction('Short text');
  
  lens.useFlash(() => {
    if (contentRef.value) {
      const rect = contentRef.value.getBoundingClientRect();
      dimensions.set({
        width: rect.width,
        height: rect.height
      });
    }
  }, [content.value]);
  
  const addMoreContent = () => {
    content.set(prev => prev + ' More text added to change dimensions.');
  };
  
  return (
    <div>
      <div ref={(el) => contentRef.set(el)} style={{ border: '1px solid #ccc', padding: '10px' }}>
        {content.value}
      </div>
      <p>Dimensions: {dimensions.value.width}px × {dimensions.value.height}px</p>
      <button onClick={addMoreContent}>Add More Content</button>
    </div>
  );
});
```

### Scroll Position

```javascript
const ScrollPosition = createComponent(({ lens }) => {
  const containerRef = lens.useRefraction(null);
  const scrollInfo = lens.useRefraction({ top: 0, left: 0 });
  const shouldScrollToBottom = lens.useRefraction(false);
  
  lens.useFlash(() => {
    if (containerRef.value) {
      if (shouldScrollToBottom.value) {
        containerRef.value.scrollTop = containerRef.value.scrollHeight;
        shouldScrollToBottom.set(false);
      }
      
      // Update scroll position info
      scrollInfo.set({
        top: containerRef.value.scrollTop,
        left: containerRef.value.scrollLeft
      });
    }
  }, [shouldScrollToBottom.value]);
  
  return (
    <div>
      <div 
        ref={(el) => containerRef.set(el)}
        style={{ height: '200px', overflow: 'auto', border: '1px solid #ccc' }}
        onScroll={() => {
          if (containerRef.value) {
            scrollInfo.set({
              top: containerRef.value.scrollTop,
              left: containerRef.value.scrollLeft
            });
          }
        }}
      >
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} style={{ padding: '10px' }}>
            Item {i + 1}
          </div>
        ))}
      </div>
      <p>Scroll Position: {scrollInfo.value.top}px from top</p>
      <button onClick={() => shouldScrollToBottom.set(true)}>
        Scroll to Bottom
      </button>
    </div>
  );
});
```

## Advanced Patterns

### Conditional Flash Effects

```javascript
const ConditionalFlash = createComponent(({ lens, isEnabled }) => {
  const elementRef = lens.useRefraction(null);
  const counter = lens.useRefraction(0);
  
  lens.useFlash(() => {
    // Only run flash effect when enabled
    if (isEnabled && elementRef.value) {
      elementRef.value.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
      
      setTimeout(() => {
        if (elementRef.value) {
          elementRef.value.style.boxShadow = '';
        }
      }, 200);
    }
  }, [counter.value, isEnabled]);
  
  return (
    <div>
      <div ref={(el) => elementRef.set(el)} style={{ padding: '20px', border: '1px solid #ccc' }}>
        Flash effect {isEnabled ? 'enabled' : 'disabled'}
      </div>
      <button onClick={() => counter.set(prev => prev + 1)}>
        Trigger Flash ({counter.value})
      </button>
    </div>
  );
});
```

### Multiple Element Coordination

```javascript
const MultiElementFlash = createComponent(({ lens }) => {
  const elementsRef = lens.useRefraction([]);
  const animationTrigger = lens.useRefraction(false);
  
  lens.useFlash(() => {
    if (animationTrigger.value && elementsRef.value.length > 0) {
      elementsRef.value.forEach((element, index) => {
        if (element) {
          setTimeout(() => {
            element.style.transform = 'scale(1.1)';
            element.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
              element.style.transform = 'scale(1)';
            }, 200);
          }, index * 100);
        }
      });
      
      animationTrigger.set(false);
    }
  }, [animationTrigger.value]);
  
  const setElementRef = (index) => (el) => {
    elementsRef.set(prev => {
      const newRefs = [...prev];
      newRefs[index] = el;
      return newRefs;
    });
  };
  
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            ref={setElementRef(i)}
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#007bff',
              borderRadius: '4px'
            }}
          />
        ))}
      </div>
      <button onClick={() => animationTrigger.set(true)}>
        Animate All Elements
      </button>
    </div>
  );
});
```

## Integration with Third-Party Libraries

### Chart Libraries

```javascript
const ChartIntegration = createComponent(({ lens, data }) => {
  const chartRef = lens.useRefraction(null);
  const chartInstance = lens.useRefraction(null);
  
  // Initialize chart after mount
  lens.useFlash(() => {
    if (chartRef.value && !chartInstance.value) {
      // Initialize chart library (e.g., Chart.js)
      const chart = new Chart(chartRef.value, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          animation: {
            duration: 1000
          }
        }
      });
      
      chartInstance.set(chart);
    }
  }, []);
  
  // Update chart when data changes
  lens.useFlash(() => {
    if (chartInstance.value && data) {
      chartInstance.value.data = data;
      chartInstance.value.update('active');
    }
  }, [data]);
  
  return (
    <div>
      <canvas ref={(el) => chartRef.set(el)} />
    </div>
  );
});
```

### Animation Libraries

```javascript
const AnimationLibrary = createComponent(({ lens }) => {
  const elementRef = lens.useRefraction(null);
  const shouldAnimate = lens.useRefraction(false);
  
  lens.useFlash(() => {
    if (elementRef.value && shouldAnimate.value) {
      // Using GSAP or similar animation library
      gsap.fromTo(elementRef.value, 
        { 
          opacity: 0, 
          y: 50 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5,
          ease: "power2.out"
        }
      );
      
      shouldAnimate.set(false);
    }
  }, [shouldAnimate.value]);
  
  return (
    <div>
      <div ref={(el) => elementRef.set(el)}>
        Animated with GSAP
      </div>
      <button onClick={() => shouldAnimate.set(true)}>
        Animate
      </button>
    </div>
  );
});
```

## Performance Considerations

### Avoiding Expensive Operations

```javascript
const PerformantFlash = createComponent(({ lens }) => {
  const elementRef = lens.useRefraction(null);
  const needsUpdate = lens.useRefraction(false);
  
  lens.useFlash(() => {
    if (needsUpdate.value && elementRef.value) {
      // Use requestAnimationFrame for smooth animations
      requestAnimationFrame(() => {
        if (elementRef.value) {
          // Batch DOM operations
          elementRef.value.style.cssText = `
            transform: translateX(100px);
            opacity: 0.5;
            transition: all 0.3s ease;
          `;
        }
      });
      
      needsUpdate.set(false);
    }
  }, [needsUpdate.value]);
  
  return (
    <div>
      <div ref={(el) => elementRef.set(el)}>
        Performant element
      </div>
      <button onClick={() => needsUpdate.set(true)}>
        Update
      </button>
    </div>
  );
});
```

## Testing Flash Effects

### Testing DOM Manipulation

```javascript
import { render, act } from '@refract/testing-utils';

describe('Flash Effects', () => {
  test('applies styles after render', async () => {
    const TestComponent = createComponent(({ lens }) => {
      const elementRef = lens.useRefraction(null);
      const trigger = lens.useRefraction(false);
      
      lens.useFlash(() => {
        if (elementRef.value && trigger.value) {
          elementRef.value.style.backgroundColor = 'red';
        }
      }, [trigger.value]);
      
      return (
        <div>
          <div ref={(el) => elementRef.set(el)} data-testid="target">
            Target Element
          </div>
          <button onClick={() => trigger.set(true)}>
            Trigger
          </button>
        </div>
      );
    });
    
    const { getByTestId, getByRole } = render(<TestComponent />);
    const targetElement = getByTestId('target');
    
    expect(targetElement.style.backgroundColor).toBe('');
    
    act(() => {
      fireEvent.click(getByRole('button'));
    });
    
    // Flash effects run after render
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(targetElement.style.backgroundColor).toBe('red');
  });
});
```

## Best Practices

### 1. Use for Post-Render Operations Only
```javascript
// ✅ Good - DOM manipulation after render
lens.useFlash(() => {
  if (elementRef.value) {
    elementRef.value.focus();
  }
}, [shouldFocus]);

// ❌ Bad - State updates (use useEffect instead)
lens.useFlash(() => {
  setState(newValue); // This should be in useEffect
}, [trigger]);
```

### 2. Check Element Existence
```javascript
// ✅ Good - Always check if element exists
lens.useFlash(() => {
  if (elementRef.value) {
    elementRef.value.style.color = 'red';
  }
}, [trigger]);

// ❌ Bad - No null check
lens.useFlash(() => {
  elementRef.value.style.color = 'red'; // May throw error
}, [trigger]);
```

### 3. Use Specific Dependencies
```javascript
// ✅ Good - Specific dependencies
lens.useFlash(() => {
  animateElement();
}, [animationTrigger]);

// ❌ Bad - Missing or too broad dependencies
lens.useFlash(() => {
  animateElement();
}, []); // Missing dependency
```

### 4. Batch DOM Operations
```javascript
// ✅ Good - Batch DOM operations
lens.useFlash(() => {
  if (elementRef.value) {
    const element = elementRef.value;
    element.style.cssText = `
      transform: scale(1.1);
      opacity: 0.8;
      transition: all 0.3s ease;
    `;
  }
}, [trigger]);

// ❌ Bad - Multiple style assignments
lens.useFlash(() => {
  if (elementRef.value) {
    elementRef.value.style.transform = 'scale(1.1)';
    elementRef.value.style.opacity = '0.8';
    elementRef.value.style.transition = 'all 0.3s ease';
  }
}, [trigger]);
```

## Related APIs

- **[useEffect](./useEffect)** - Side effects with cleanup support
- **[useRefraction](./useRefraction)** - State that can trigger flash effects
- **[createComponent](./createComponent)** - Components that use flash effects
- **[useOptic](./useOptic)** - Reusable logic that may include flash effects
