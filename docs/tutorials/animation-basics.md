# Animation Basics

Learn how to create smooth, performant animations in Refract using refractions, effects, and CSS transitions.

## Overview

This tutorial covers the fundamentals of animation in Refract, from simple CSS transitions to complex coordinated animations using the framework's reactive state management.

## What You'll Build

- Animated UI components with smooth transitions
- State-driven animations using refractions
- Coordinated multi-element animations
- Performance-optimized animation patterns
- Interactive animation controls

## Prerequisites

- Understanding of Refract components and refractions
- Basic CSS animation knowledge
- Familiarity with CSS transforms and transitions

## Step 1: Basic CSS Transitions

Start with simple CSS-based animations that respond to state changes:

```javascript
// components/AnimatedButton.js
import { createComponent } from 'refract-js';

const AnimatedButton = createComponent(({ lens, children, onClick }) => {
  const isPressed = lens.useRefraction(false);
  const isHovered = lens.useRefraction(false);

  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: `
      scale(${isPressed.value ? 0.95 : isHovered.value ? 1.05 : 1})
      translateY(${isPressed.value ? '2px' : isHovered.value ? '-2px' : '0px'})
    `,
    boxShadow: isHovered.value 
      ? '0 10px 25px rgba(102, 126, 234, 0.4)' 
      : '0 4px 15px rgba(102, 126, 234, 0.2)',
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => isHovered.set(true)}
      onMouseLeave={() => isHovered.set(false)}
      onMouseDown={() => isPressed.set(true)}
      onMouseUp={() => isPressed.set(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

export default AnimatedButton;
```

## Step 2: State-Driven Animations

Create animations that respond to application state changes:

```javascript
// components/ProgressBar.js
import { createComponent } from 'refract-js';

const ProgressBar = createComponent(({ lens, progress = 0, animated = true }) => {
  const animatedProgress = lens.useRefraction(0);
  const isVisible = lens.useRefraction(false);

  // Animate progress changes
  lens.useEffect(() => {
    if (animated) {
      const duration = 1000; // 1 second
      const startTime = Date.now();
      const startProgress = animatedProgress.value;
      const targetProgress = Math.max(0, Math.min(100, progress));

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - t, 3);
        const currentProgress = startProgress + (targetProgress - startProgress) * eased;
        
        animatedProgress.set(currentProgress);
        
        if (t < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      animatedProgress.set(progress);
    }
  }, [progress, animated]);

  // Entrance animation
  lens.useEffect(() => {
    const timer = setTimeout(() => isVisible.set(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const containerStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    opacity: isVisible.value ? 1 : 0,
    transform: `scaleX(${isVisible.value ? 1 : 0})`,
    transformOrigin: 'left center',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  };

  const fillStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
    borderRadius: '4px',
    width: `${animatedProgress.value}%`,
    transition: animated ? 'none' : 'width 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const shimmerStyle = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    animation: animatedProgress.value > 0 ? 'shimmer 2s infinite' : 'none',
  };

  return (
    <div style={containerStyle}>
      <div style={fillStyle}>
        <div style={shimmerStyle} />
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
});

export default ProgressBar;
```

## Step 3: Coordinated Animations

Create animations that coordinate multiple elements:

```javascript
// components/StaggeredList.js
import { createComponent } from 'refract-js';

const StaggeredList = createComponent(({ lens, items = [], staggerDelay = 100 }) => {
  const visibleItems = lens.useRefraction(new Set());
  const isVisible = lens.useRefraction(false);

  // Staggered entrance animation
  lens.useEffect(() => {
    if (items.length === 0) return;

    const timer = setTimeout(() => {
      isVisible.set(true);
      
      items.forEach((_, index) => {
        setTimeout(() => {
          visibleItems.set(prev => new Set([...prev, index]));
        }, index * staggerDelay);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [items.length, staggerDelay]);

  // Reset when items change
  lens.useEffect(() => {
    visibleItems.set(new Set());
    isVisible.set(false);
  }, [items]);

  const containerStyle = {
    opacity: isVisible.value ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      {items.map((item, index) => (
        <StaggeredListItem
          key={item.id || index}
          lens={lens}
          item={item}
          index={index}
          isVisible={visibleItems.value.has(index)}
        />
      ))}
    </div>
  );
});

const StaggeredListItem = createComponent(({ lens, item, index, isVisible }) => {
  const itemStyle = {
    padding: '16px',
    margin: '8px 0',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    opacity: isVisible ? 1 : 0,
    transform: `translateY(${isVisible ? '0px' : '20px'}) scale(${isVisible ? 1 : 0.95})`,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDelay: isVisible ? '0ms' : '0ms',
  };

  return (
    <div style={itemStyle}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  );
});

export default StaggeredList;
```

## Step 4: Interactive Animations

Build animations that respond to user interactions:

```javascript
// components/DraggableCard.js
import { createComponent } from 'refract-js';

const DraggableCard = createComponent(({ lens, children }) => {
  const position = lens.useRefraction({ x: 0, y: 0 });
  const isDragging = lens.useRefraction(false);
  const dragStart = lens.useRefraction({ x: 0, y: 0 });
  const rotation = lens.useRefraction(0);

  const handleMouseDown = (e) => {
    isDragging.set(true);
    dragStart.set({
      x: e.clientX - position.value.x,
      y: e.clientY - position.value.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging.value) return;

    const newX = e.clientX - dragStart.value.x;
    const newY = e.clientY - dragStart.value.y;
    
    position.set({ x: newX, y: newY });
    
    // Add rotation based on horizontal movement
    const rotationAmount = (newX / window.innerWidth) * 30;
    rotation.set(rotationAmount);
  };

  const handleMouseUp = () => {
    isDragging.set(false);
    
    // Snap back to center with spring animation
    const springBack = () => {
      const currentPos = position.value;
      const currentRot = rotation.value;
      
      const springStrength = 0.1;
      const damping = 0.8;
      
      const newX = currentPos.x * damping;
      const newY = currentPos.y * damping;
      const newRot = currentRot * damping;
      
      position.set({ x: newX, y: newY });
      rotation.set(newRot);
      
      if (Math.abs(newX) > 1 || Math.abs(newY) > 1 || Math.abs(newRot) > 1) {
        requestAnimationFrame(springBack);
      } else {
        position.set({ x: 0, y: 0 });
        rotation.set(0);
      }
    };
    
    requestAnimationFrame(springBack);
  };

  // Add global mouse event listeners
  lens.useEffect(() => {
    if (isDragging.value) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging.value]);

  const cardStyle = {
    width: '300px',
    height: '200px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: isDragging.value 
      ? '0 20px 40px rgba(0,0,0,0.2)' 
      : '0 4px 20px rgba(0,0,0,0.1)',
    cursor: isDragging.value ? 'grabbing' : 'grab',
    userSelect: 'none',
    transform: `
      translate(${position.value.x}px, ${position.value.y}px) 
      rotate(${rotation.value}deg)
      scale(${isDragging.value ? 1.05 : 1})
    `,
    transition: isDragging.value ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div
      style={cardStyle}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
});

export default DraggableCard;
```

## Step 5: Animation Utilities

Create reusable animation utilities and hooks:

```javascript
// utils/animations.js
import { createOptic } from 'refract-js';

// Spring animation utility
export const useSpring = createOptic((lens, config = {}) => {
  const {
    stiffness = 100,
    damping = 10,
    mass = 1,
    precision = 0.01,
  } = config;

  const value = lens.useRefraction(0);
  const velocity = lens.useRefraction(0);
  const target = lens.useRefraction(0);
  const isAnimating = lens.useRefraction(false);

  const animate = () => {
    const currentValue = value.value;
    const currentVelocity = velocity.value;
    const targetValue = target.value;

    const displacement = targetValue - currentValue;
    const springForce = displacement * stiffness;
    const dampingForce = currentVelocity * damping;
    const acceleration = (springForce - dampingForce) / mass;

    const newVelocity = currentVelocity + acceleration * 0.016; // 60fps
    const newValue = currentValue + newVelocity * 0.016;

    velocity.set(newVelocity);
    value.set(newValue);

    const isSettled = Math.abs(displacement) < precision && Math.abs(newVelocity) < precision;
    
    if (!isSettled) {
      requestAnimationFrame(animate);
    } else {
      value.set(targetValue);
      velocity.set(0);
      isAnimating.set(false);
    }
  };

  const setTarget = (newTarget) => {
    target.set(newTarget);
    if (!isAnimating.value) {
      isAnimating.set(true);
      requestAnimationFrame(animate);
    }
  };

  return {
    value: value.value,
    setTarget,
    isAnimating: isAnimating.value,
  };
});

// Tween animation utility
export const useTween = createOptic((lens, duration = 1000, easing = 'ease-out') => {
  const value = lens.useRefraction(0);
  const isAnimating = lens.useRefraction(false);

  const easingFunctions = {
    'linear': t => t,
    'ease-in': t => t * t,
    'ease-out': t => 1 - Math.pow(1 - t, 2),
    'ease-in-out': t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  };

  const animate = (from, to, onComplete) => {
    const startTime = Date.now();
    const startValue = from;
    const targetValue = to;
    const easeFn = easingFunctions[easing] || easingFunctions['ease-out'];

    isAnimating.set(true);

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeFn(progress);
      const currentValue = startValue + (targetValue - startValue) * easedProgress;

      value.set(currentValue);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        isAnimating.set(false);
        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(tick);
  };

  return {
    value: value.value,
    animate,
    isAnimating: isAnimating.value,
  };
});

// Stagger utility for coordinated animations
export const useStagger = createOptic((lens, items, delay = 100) => {
  const visibleIndices = lens.useRefraction(new Set());
  const isComplete = lens.useRefraction(false);

  const start = () => {
    visibleIndices.set(new Set());
    isComplete.set(false);

    items.forEach((_, index) => {
      setTimeout(() => {
        visibleIndices.set(prev => new Set([...prev, index]));
        
        if (index === items.length - 1) {
          setTimeout(() => isComplete.set(true), delay);
        }
      }, index * delay);
    });
  };

  const reset = () => {
    visibleIndices.set(new Set());
    isComplete.set(false);
  };

  return {
    visibleIndices: visibleIndices.value,
    isComplete: isComplete.value,
    start,
    reset,
  };
});
```

## Step 6: Performance Optimization

Optimize animations for better performance:

```javascript
// components/OptimizedAnimatedList.js
import { createComponent } from 'refract-js';

const OptimizedAnimatedList = createComponent(({ lens, items }) => {
  const animationState = lens.useRefraction('idle'); // idle, entering, visible, exiting
  const visibleItems = lens.useRefraction([]);

  // Use RAF for smooth animations
  const animateIn = () => {
    animationState.set('entering');
    
    const batchSize = 5;
    let currentBatch = 0;
    
    const processBatch = () => {
      const start = currentBatch * batchSize;
      const end = Math.min(start + batchSize, items.length);
      const batch = items.slice(start, end);
      
      visibleItems.set(prev => [...prev, ...batch]);
      currentBatch++;
      
      if (end < items.length) {
        requestAnimationFrame(processBatch);
      } else {
        animationState.set('visible');
      }
    };
    
    requestAnimationFrame(processBatch);
  };

  // Trigger animation on mount
  lens.useEffect(() => {
    if (items.length > 0) {
      animateIn();
    }
  }, [items.length]);

  // Use CSS transforms instead of changing layout properties
  const containerStyle = {
    opacity: animationState.value === 'idle' ? 0 : 1,
    transform: `translateY(${animationState.value === 'idle' ? '20px' : '0px'})`,
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    willChange: animationState.value === 'entering' ? 'transform, opacity' : 'auto',
  };

  return (
    <div style={containerStyle}>
      {visibleItems.value.map((item, index) => (
        <OptimizedListItem
          key={item.id}
          lens={lens}
          item={item}
          index={index}
        />
      ))}
    </div>
  );
});

const OptimizedListItem = createComponent(({ lens, item, index }) => {
  const isVisible = lens.useRefraction(false);

  lens.useEffect(() => {
    // Stagger the appearance
    const timer = setTimeout(() => {
      isVisible.set(true);
    }, index * 50);

    return () => clearTimeout(timer);
  }, [index]);

  const itemStyle = {
    opacity: isVisible.value ? 1 : 0,
    transform: `translateX(${isVisible.value ? '0px' : '-20px'})`,
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    // Use transform3d to enable hardware acceleration
    transform: `translate3d(${isVisible.value ? '0px' : '-20px'}, 0, 0)`,
    willChange: isVisible.value ? 'auto' : 'transform, opacity',
  };

  return (
    <div style={itemStyle}>
      {item.content}
    </div>
  );
});

export default OptimizedAnimatedList;
```

## Step 7: Complete Animation Demo

Put everything together in a comprehensive demo:

```javascript
// App.js
import { createComponent, createApp } from 'refract-js';
import AnimatedButton from './components/AnimatedButton.js';
import ProgressBar from './components/ProgressBar.js';
import StaggeredList from './components/StaggeredList.js';
import DraggableCard from './components/DraggableCard.js';
import { useSpring, useTween } from './utils/animations.js';

const AnimationDemo = createComponent(({ lens }) => {
  const progress = lens.useRefraction(0);
  const spring = useSpring(lens, { stiffness: 120, damping: 14 });
  const tween = useTween(lens, 2000, 'ease-in-out');

  const demoItems = [
    { id: 1, title: 'Smooth Transitions', description: 'CSS-based animations with state' },
    { id: 2, title: 'Spring Physics', description: 'Natural motion with spring animations' },
    { id: 3, title: 'Coordinated Motion', description: 'Multiple elements moving together' },
    { id: 4, title: 'Interactive Gestures', description: 'Drag and drop with physics' },
  ];

  const handleProgressUpdate = () => {
    const newProgress = Math.min(progress.value + 25, 100);
    progress.set(newProgress);
  };

  const handleSpringDemo = () => {
    spring.setTarget(Math.random() * 200);
  };

  const handleTweenDemo = () => {
    tween.animate(0, 100, () => {
      setTimeout(() => tween.animate(100, 0), 500);
    });
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Refract Animation Showcase</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>Interactive Buttons</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <AnimatedButton lens={lens} onClick={handleProgressUpdate}>
            Update Progress
          </AnimatedButton>
          <AnimatedButton lens={lens} onClick={handleSpringDemo}>
            Spring Demo
          </AnimatedButton>
          <AnimatedButton lens={lens} onClick={handleTweenDemo}>
            Tween Demo
          </AnimatedButton>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Progress Animation</h2>
        <ProgressBar lens={lens} progress={progress.value} />
        <p>Progress: {Math.round(progress.value)}%</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Spring Physics</h2>
        <div style={{ height: '60px', position: 'relative', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <div style={{
            position: 'absolute',
            left: `${spring.value}px`,
            top: '10px',
            width: '40px',
            height: '40px',
            backgroundColor: '#667eea',
            borderRadius: '50%',
            transition: 'none',
          }} />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Tween Animation</h2>
        <div style={{ height: '60px', position: 'relative', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <div style={{
            position: 'absolute',
            left: `${tween.value * 2}px`,
            top: '10px',
            width: '40px',
            height: '40px',
            backgroundColor: '#764ba2',
            borderRadius: '8px',
            transition: 'none',
          }} />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Staggered List</h2>
        <StaggeredList lens={lens} items={demoItems} />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Draggable Card</h2>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <DraggableCard lens={lens}>
            <div style={{ textAlign: 'center' }}>
              <h3>Drag Me!</h3>
              <p>Click and drag to move</p>
            </div>
          </DraggableCard>
        </div>
      </section>
    </div>
  );
});

const app = createApp();
app.mount(AnimationDemo, '#root');
```

## Best Practices

1. **Use CSS transforms** instead of changing layout properties for better performance
2. **Enable hardware acceleration** with `transform3d()` and `will-change`
3. **Batch DOM updates** using `requestAnimationFrame`
4. **Clean up animations** in effect cleanup functions
5. **Respect user preferences** like `prefers-reduced-motion`
6. **Use appropriate easing** functions for natural motion
7. **Optimize for 60fps** by keeping frame budgets under 16ms

## Performance Tips

- Use `transform` and `opacity` for animations when possible
- Avoid animating layout properties like `width`, `height`, `top`, `left`
- Use `will-change` sparingly and remove it when animations complete
- Debounce rapid state changes that trigger animations
- Consider using CSS animations for simple, repeating animations

## Accessibility Considerations

```javascript
// Respect user motion preferences
const respectsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animationDuration = respectsReducedMotion ? 0 : 300;
const shouldAnimate = !respectsReducedMotion;
```

## Conclusion

You've learned how to create smooth, performant animations in Refract using a combination of reactive state management and modern CSS techniques. These patterns provide a solid foundation for building engaging, interactive user interfaces that feel responsive and polished.
