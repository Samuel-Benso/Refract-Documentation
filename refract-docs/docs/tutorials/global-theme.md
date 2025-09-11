# Global Theme Management

Learn how to implement a global theme system in Refract using refractions and optics for consistent styling across your application.

## Overview

This tutorial demonstrates how to create a flexible theme system that allows users to switch between light and dark modes, customize colors, and maintain theme persistence across sessions.

## What You'll Build

- A global theme provider using refractions
- Theme switching functionality
- Persistent theme storage
- Dynamic CSS custom properties
- Theme-aware components

## Prerequisites

- Basic understanding of Refract components and refractions
- Familiarity with CSS custom properties
- Knowledge of localStorage API

## Step 1: Create the Theme Store

First, let's create a global theme store using refractions:

```javascript
// theme/themeStore.js
import { createRefraction } from 'refract-js';

// Define available themes
export const themes = {
  light: {
    name: 'light',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#adb5bd',
      border: '#343a40',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
    },
  },
};

// Load theme from localStorage or default to light
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('refract-theme');
    return saved && themes[saved] ? themes[saved] : themes.light;
  }
  return themes.light;
};

// Create global theme refraction
export const themeStore = createRefraction(getInitialTheme());
```

## Step 2: Create Theme Provider Component

Now let's create a theme provider that applies CSS custom properties:

```javascript
// theme/ThemeProvider.js
import { createComponent } from 'refract-js';
import { themeStore } from './themeStore.js';

const ThemeProvider = createComponent(({ lens, children }) => {
  const theme = lens.useRefraction(themeStore);

  // Apply theme to CSS custom properties
  lens.useEffect(() => {
    const root = document.documentElement;
    const currentTheme = theme.value;

    // Apply color variables
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply spacing variables
    Object.entries(currentTheme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply border radius variables
    Object.entries(currentTheme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Add theme class to body
    document.body.className = `theme-${currentTheme.name}`;

    // Persist theme choice
    localStorage.setItem('refract-theme', currentTheme.name);
  }, [theme.value]);

  return (
    <div className="theme-provider">
      {children}
    </div>
  );
});

export default ThemeProvider;
```

## Step 3: Create Theme Utilities

Let's create utility functions and hooks for working with themes:

```javascript
// theme/useTheme.js
import { createOptic } from 'refract-js';
import { themeStore, themes } from './themeStore.js';

export const useTheme = createOptic((lens) => {
  const theme = lens.useRefraction(themeStore);

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      theme.set(themes[themeName]);
    }
  };

  const toggleTheme = () => {
    const current = theme.value.name;
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const isDark = theme.value.name === 'dark';
  const isLight = theme.value.name === 'light';

  return {
    theme: theme.value,
    setTheme,
    toggleTheme,
    isDark,
    isLight,
    availableThemes: Object.keys(themes),
  };
});
```

## Step 4: Create Theme Switcher Component

Now let's build a component for switching themes:

```javascript
// components/ThemeSwitcher.js
import { createComponent } from 'refract-js';
import { useTheme } from '../theme/useTheme.js';

const ThemeSwitcher = createComponent(({ lens }) => {
  const { theme, toggleTheme, isDark } = useTheme(lens);

  return (
    <button 
      className="theme-switcher"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span className="theme-icon">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="theme-label">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
});

export default ThemeSwitcher;
```

## Step 5: Create Theme-Aware Components

Let's create components that respond to theme changes:

```javascript
// components/Card.js
import { createComponent } from 'refract-js';
import { useTheme } from '../theme/useTheme.js';

const Card = createComponent(({ lens, children, className = '' }) => {
  const { theme } = useTheme(lens);

  const cardStyle = {
    backgroundColor: `var(--color-surface)`,
    color: `var(--color-text)`,
    border: `1px solid var(--color-border)`,
    borderRadius: `var(--radius-md)`,
    padding: `var(--spacing-lg)`,
    boxShadow: `0 2px 8px var(--color-shadow)`,
    transition: 'all 0.2s ease',
  };

  return (
    <div 
      className={`card ${className}`}
      style={cardStyle}
    >
      {children}
    </div>
  );
});

export default Card;
```

## Step 6: Add CSS Styles

Create CSS that works with your theme system:

```css
/* styles/theme.css */
:root {
  /* Default light theme variables will be set by ThemeProvider */
  --transition-theme: all 0.2s ease;
}

.theme-provider {
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: var(--transition-theme);
}

.theme-switcher {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-theme);
}

.theme-switcher:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-1px);
}

.theme-icon {
  font-size: 1.2em;
}

.theme-label {
  font-weight: 500;
}

/* Theme-specific styles */
.theme-light {
  color-scheme: light;
}

.theme-dark {
  color-scheme: dark;
}

/* Smooth transitions for theme changes */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
```

## Step 7: Complete App Setup

Finally, let's put it all together in your main app:

```javascript
// App.js
import { createComponent, createApp } from 'refract-js';
import ThemeProvider from './theme/ThemeProvider.js';
import ThemeSwitcher from './components/ThemeSwitcher.js';
import Card from './components/Card.js';
import './styles/theme.css';

const App = createComponent(({ lens }) => {
  return (
    <ThemeProvider lens={lens}>
      <div className="app">
        <header className="app-header">
          <h1>Refract Theme Demo</h1>
          <ThemeSwitcher lens={lens} />
        </header>
        
        <main className="app-main">
          <Card lens={lens} className="welcome-card">
            <h2>Welcome to Refract!</h2>
            <p>This app demonstrates global theme management with automatic persistence and smooth transitions.</p>
          </Card>
          
          <Card lens={lens} className="features-card">
            <h3>Theme Features</h3>
            <ul>
              <li>Light and dark mode support</li>
              <li>Persistent theme selection</li>
              <li>CSS custom properties integration</li>
              <li>Smooth theme transitions</li>
              <li>Theme-aware components</li>
            </ul>
          </Card>
        </main>
      </div>
    </ThemeProvider>
  );
});

const app = createApp();
app.mount(App, '#root');
```

## Advanced Features

### Custom Theme Creation

You can extend the theme system to support custom themes:

```javascript
// theme/customThemes.js
export const createCustomTheme = (name, overrides) => {
  return {
    name,
    ...themes.light,
    ...overrides,
    colors: {
      ...themes.light.colors,
      ...overrides.colors,
    },
  };
};

// Usage
const oceanTheme = createCustomTheme('ocean', {
  colors: {
    primary: '#0077be',
    background: '#f0f8ff',
    surface: '#e6f3ff',
  },
});
```

### System Theme Detection

Add automatic system theme detection:

```javascript
// theme/systemTheme.js
export const useSystemTheme = createOptic((lens) => {
  const { setTheme } = useTheme(lens);
  
  lens.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Set initial theme based on system preference
    handleChange(mediaQuery);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
});
```

## Best Practices

1. **Performance**: Use CSS custom properties for theme values to avoid re-rendering components
2. **Accessibility**: Respect user's `prefers-color-scheme` setting
3. **Persistence**: Save theme preferences to localStorage
4. **Transitions**: Add smooth transitions between theme changes
5. **Fallbacks**: Always provide fallback values for theme properties

## Troubleshooting

### Theme Not Persisting
- Check localStorage permissions
- Verify theme names match exactly
- Ensure ThemeProvider is mounted before other components

### Styles Not Updating
- Confirm CSS custom properties are properly set
- Check for CSS specificity issues
- Verify theme transitions are not interfering

### Performance Issues
- Use CSS custom properties instead of inline styles
- Avoid unnecessary re-renders by memoizing theme values
- Consider using CSS-in-JS libraries for complex theming

## Next Steps

- Explore animation integration with themes
- Learn about server-side rendering with themes
- Build more complex theme-aware components
- Implement theme customization interfaces

## Conclusion

You've successfully implemented a comprehensive global theme system in Refract! This system provides a solid foundation for building applications with consistent, customizable styling that respects user preferences and maintains state across sessions.

The combination of Refract's reactive state management with CSS custom properties creates a powerful and performant theming solution that scales well with your application's growth.
