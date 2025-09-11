# createApp

The `createApp` function initializes a new Refract application instance. It serves as the entry point for your application, handling the root component setup and providing configuration options for the entire application.

## Syntax

```javascript
createApp(RootComponent, options?)
```

## Parameters

### `RootComponent`
- **Type:** `Component`
- **Required:** Yes
- **Description:** The root component that will serve as the entry point for your application

### `options`
- **Type:** `AppOptions`
- **Required:** No
- **Description:** Configuration options for the application

```typescript
interface AppOptions {
  // Development mode settings
  devMode?: boolean;
  
  // Error handling
  errorBoundary?: Component;
  onError?: (error: Error, errorInfo: any) => void;
  
  // Performance settings
  batchUpdates?: boolean;
  
  // Plugin system
  plugins?: Plugin[];
}
```

## Return Value

Returns an `App` instance with the following methods:

```typescript
interface App {
  mount(selector: string | Element): void;
  unmount(): void;
  getConfig(): AppConfig;
  use(plugin: Plugin): App;
}
```

## Basic Usage

### Simple Application

```javascript
import { createApp, createComponent } from 'refract';

const App = createComponent(({ lens }) => {
  const message = lens.useRefraction('Hello, Refract!');
  
  return (
    <div>
      <h1>{message.value}</h1>
      <button onClick={() => message.set('Updated!')}>
        Update Message
      </button>
    </div>
  );
});

// Create and mount the application
const app = createApp(App);
app.mount('#root');
```

### Application with Configuration

```javascript
import { createApp, createComponent } from 'refract';

const ErrorBoundary = createComponent(({ lens, children, error }) => {
  if (error) {
    return (
      <div className="error-boundary">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Reload Page
        </button>
      </div>
    );
  }
  
  return children;
});

const App = createComponent(({ lens }) => {
  return (
    <div>
      <h1>My Refract App</h1>
    </div>
  );
});

const app = createApp(App, {
  devMode: process.env.NODE_ENV === 'development',
  errorBoundary: ErrorBoundary,
  onError: (error, errorInfo) => {
    console.error('Application error:', error, errorInfo);
    // Send to error reporting service
  },
  batchUpdates: true
});

app.mount('#root');
```

## App Instance Methods

### `mount(selector)`

Mounts the application to a DOM element.

#### Parameters
- `selector` (string | Element): CSS selector string or DOM element

#### Example

```javascript
const app = createApp(App);

// Mount using CSS selector
app.mount('#root');

// Mount using DOM element
const rootElement = document.getElementById('root');
app.mount(rootElement);

// Mount to body
app.mount(document.body);
```

### `unmount()`

Unmounts the application and cleans up all resources.

#### Example

```javascript
const app = createApp(App);
app.mount('#root');

// Later, unmount the application
app.unmount();
```

### `use(plugin)`

Adds a plugin to the application.

#### Parameters
- `plugin` (Plugin): Plugin instance to add

#### Example

```javascript
import { createApp } from 'refract';
import { routerPlugin } from '@refract/router';
import { devToolsPlugin } from '@refract/devtools';

const app = createApp(App)
  .use(routerPlugin({
    routes: [
      { path: '/', component: Home },
      { path: '/about', component: About }
    ]
  }))
  .use(devToolsPlugin());

app.mount('#root');
```

## Configuration Options

### Development Mode

Enable development features like detailed error messages and performance warnings:

```javascript
const app = createApp(App, {
  devMode: true // Enables development features
});
```

### Error Handling

#### Global Error Boundary

```javascript
const GlobalErrorBoundary = createComponent(({ lens, children, error }) => {
  const hasError = lens.useRefraction(false);
  
  lens.useEffect(() => {
    if (error) {
      hasError.set(true);
    }
  }, [error]);
  
  if (hasError.value) {
    return (
      <div className="global-error">
        <h1>Oops! Something went wrong</h1>
        <details>
          <summary>Error details</summary>
          <pre>{error?.stack}</pre>
        </details>
        <button onClick={() => hasError.set(false)}>
          Try Again
        </button>
      </div>
    );
  }
  
  return children;
});

const app = createApp(App, {
  errorBoundary: GlobalErrorBoundary,
  onError: (error, errorInfo) => {
    // Log to external service
    console.error('Global error:', error);
    
    // Send to analytics
    analytics.track('application_error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }
});
```

#### Custom Error Handler

```javascript
const app = createApp(App, {
  onError: (error, errorInfo) => {
    // Custom error handling logic
    if (error.name === 'ChunkLoadError') {
      // Handle code splitting errors
      window.location.reload();
    } else {
      // Send to error reporting service
      errorReportingService.captureException(error, {
        extra: errorInfo
      });
    }
  }
});
```

### Performance Configuration

```javascript
const app = createApp(App, {
  batchUpdates: true, // Batch state updates for better performance
  
  // Custom batching configuration
  batchingOptions: {
    maxBatchSize: 100,
    batchTimeout: 16 // ~60fps
  }
});
```

## Advanced Usage

### Multiple App Instances

```javascript
// Main application
const mainApp = createApp(MainApp);
mainApp.mount('#main-app');

// Widget application (separate instance)
const widgetApp = createApp(WidgetApp);
widgetApp.mount('#widget');

// Both apps can run independently
```

### App with Plugins

```javascript
import { createApp } from 'refract';
import { routerPlugin } from '@refract/router';
import { storePlugin } from '@refract/store';
import { i18nPlugin } from '@refract/i18n';

const app = createApp(App)
  .use(routerPlugin({
    mode: 'history',
    base: '/app/'
  }))
  .use(storePlugin({
    modules: {
      user: userStore,
      cart: cartStore
    }
  }))
  .use(i18nPlugin({
    locale: 'en',
    messages: {
      en: englishMessages,
      es: spanishMessages
    }
  }));

app.mount('#root');
```

### Server-Side Rendering

```javascript
// server.js
import { createApp, renderToString } from 'refract';
import App from './App';

const app = createApp(App, {
  // SSR-specific configuration
  ssr: true,
  hydrate: false
});

const html = await renderToString(app);

// client.js
import { createApp } from 'refract';
import App from './App';

const app = createApp(App, {
  hydrate: true // Enable hydration mode
});

app.mount('#root');
```

## Error Scenarios

### Mount Errors

```javascript
const app = createApp(App);

try {
  app.mount('#nonexistent');
} catch (error) {
  console.error('Mount failed:', error.message);
  // Fallback: mount to body
  app.mount(document.body);
}
```

### Component Errors

```javascript
const BuggyComponent = createComponent(({ lens }) => {
  lens.useEffect(() => {
    throw new Error('Something went wrong!');
  }, []);
  
  return <div>This won't render due to error</div>;
});

const App = createComponent(({ lens }) => {
  return (
    <div>
      <h1>My App</h1>
      <BuggyComponent />
    </div>
  );
});

const app = createApp(App, {
  onError: (error, errorInfo) => {
    console.error('Component error caught:', error);
    // Error is handled, app continues running
  }
});
```

## Testing

### Testing App Creation

```javascript
import { createApp } from 'refract';
import { render } from '@refract/testing-utils';

describe('App Creation', () => {
  test('creates app instance', () => {
    const TestComponent = createComponent(() => <div>Test</div>);
    const app = createApp(TestComponent);
    
    expect(app).toBeDefined();
    expect(typeof app.mount).toBe('function');
    expect(typeof app.unmount).toBe('function');
  });
  
  test('mounts and unmounts correctly', () => {
    const TestComponent = createComponent(() => <div>Test</div>);
    const app = createApp(TestComponent);
    
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    app.mount(container);
    expect(container.innerHTML).toContain('Test');
    
    app.unmount();
    expect(container.innerHTML).toBe('');
    
    document.body.removeChild(container);
  });
});
```

### Testing with Configuration

```javascript
test('handles errors correctly', () => {
  const errorSpy = jest.fn();
  
  const BuggyComponent = createComponent(() => {
    throw new Error('Test error');
  });
  
  const app = createApp(BuggyComponent, {
    onError: errorSpy
  });
  
  const container = document.createElement('div');
  app.mount(container);
  
  expect(errorSpy).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Test error' }),
    expect.any(Object)
  );
});
```

## Best Practices

### 1. Single App Instance
```javascript
// ✅ Good - Single app instance
const app = createApp(App);
app.mount('#root');

// ❌ Bad - Multiple instances for same app
const app1 = createApp(App);
const app2 = createApp(App);
```

### 2. Proper Error Handling
```javascript
// ✅ Good - Comprehensive error handling
const app = createApp(App, {
  errorBoundary: ErrorBoundary,
  onError: (error, errorInfo) => {
    logError(error, errorInfo);
    reportToService(error);
  }
});

// ❌ Bad - No error handling
const app = createApp(App);
```

### 3. Environment-Specific Configuration
```javascript
// ✅ Good - Environment-aware configuration
const app = createApp(App, {
  devMode: process.env.NODE_ENV === 'development',
  onError: process.env.NODE_ENV === 'production' 
    ? reportToService 
    : console.error
});
```

### 4. Graceful Cleanup
```javascript
// ✅ Good - Proper cleanup
window.addEventListener('beforeunload', () => {
  app.unmount();
});

// Handle hot module replacement in development
if (module.hot) {
  module.hot.accept('./App', () => {
    app.unmount();
    const NextApp = require('./App').default;
    const newApp = createApp(NextApp);
    newApp.mount('#root');
  });
}
```

## Related APIs

- **[createComponent](./createComponent)** - Create components for your app
- **[mount](./createApp#mount)** - Mount the application
- **[useRefraction](./useRefraction)** - Manage state in components
- **[useEffect](./useEffect)** - Handle side effects
