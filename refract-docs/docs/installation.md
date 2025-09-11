# Installation

Get Refract installed and ready to use in your project. Choose the method that best fits your development workflow.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- A modern code editor (VS Code recommended)

## Quick Start

### Create a New Project

The fastest way to get started is using the Refract CLI:

```bash
npx create-refract-app my-app
cd my-app
npm start
```

This creates a new Refract project with:
- Modern build tooling (Vite)
- TypeScript support
- Hot module replacement
- Optimized production builds
- Example components and documentation

### Add to Existing Project

If you want to add Refract to an existing project:

```bash
npm install refract-js
# or
yarn add refract-js
```

## Package Managers

### npm
```bash
npm install refract-js
```

### Yarn
```bash
yarn add refract-js
```

### pnpm
```bash
pnpm add refract-js
```

## CDN Installation

For quick prototyping or simple projects, you can use Refract directly from a CDN:

```html
<!-- Development version -->
<script src="https://unpkg.com/refract-js@latest/dist/refract.development.js"></script>

<!-- Production version (minified) -->
<script src="https://unpkg.com/refract-js@latest/dist/refract.production.min.js"></script>
```

## TypeScript Support

Refract includes built-in TypeScript definitions. No additional packages needed:

```bash
npm install refract-js
# TypeScript definitions included automatically
```

## Development Tools

### Browser Extension

Install the Refract DevTools browser extension for debugging:

- [Chrome Extension](https://chrome.google.com/webstore/detail/refract-devtools)
- [Firefox Add-on](https://addons.mozilla.org/firefox/addon/refract-devtools)

### VS Code Extension

Enhance your development experience with syntax highlighting and IntelliSense:

```bash
code --install-extension refract-js.refract-vscode
```

## Build Tools Integration

### Vite (Recommended)

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import refract from '@refract-js/vite-plugin';

export default defineConfig({
  plugins: [refract()],
});
```

### Webpack

```javascript
// webpack.config.js
const RefractPlugin = require('@refract-js/webpack-plugin');

module.exports = {
  plugins: [
    new RefractPlugin()
  ]
};
```

### Rollup

```javascript
// rollup.config.js
import refract from '@refract-js/rollup-plugin';

export default {
  plugins: [refract()]
};
```

## Verification

Verify your installation by creating a simple component:

```javascript
// test-refract.js
import { createApp, createComponent } from 'refract-js';

const TestComponent = createComponent(({ lens }) => {
  const message = lens.useRefraction('Refract is working!');
  
  return <h1>{message.value}</h1>;
});

createApp(TestComponent).mount('#root');
```

If you see "Refract is working!" in your browser, you're all set!

## Troubleshooting

### Common Issues

#### Module Resolution Errors
If you encounter module resolution issues, ensure your bundler supports ES modules:

```javascript
// package.json
{
  "type": "module"
}
```

#### TypeScript Configuration
For TypeScript projects, add Refract to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

#### Build Errors
If you encounter build errors, ensure you're using compatible versions:

```bash
npm ls refract-js
```

### Getting Help

- 📚 [Documentation](https://refract-docs.netlify.app)
- 💬 [Discord Community](https://discord.gg/refract)
- 🐛 [GitHub Issues](https://github.com/refract-js/refract/issues)
- 📧 [Support Email](mailto:support@refract-js.org)

## Next Steps

Now that Refract is installed, continue with:

1. **[Getting Started Guide](./getting-started)** - Build your first application
2. **[Core Concepts](./concepts/components)** - Learn the fundamentals
3. **[API Reference](./api/overview)** - Explore all available APIs
4. **[Tutorials](./tutorials/counter-app)** - Follow step-by-step guides
