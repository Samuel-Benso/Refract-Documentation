# Contributing to Refract

Thank you for your interest in contributing to Refract! This guide will help you get started with contributing to the framework and its documentation.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at conduct@refract-js.org.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 16+ installed
- Git installed and configured
- A GitHub account
- Basic knowledge of JavaScript/TypeScript
- Familiarity with React concepts

### First-Time Contributors

If you're new to open source, we recommend:

1. Reading our [documentation](./intro.md) thoroughly
2. Exploring the [tutorials](./tutorials/counter-app.md)
3. Looking for issues labeled `good first issue`
4. Joining our [Discord community](#community)

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/refract.git
cd refract

# Add the original repository as upstream
git remote add upstream https://github.com/refract-js/refract.git
```

### 2. Install Dependencies

```bash
# Install dependencies
npm install

# Install development tools
npm run setup:dev
```

### 3. Build and Test

```bash
# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### 4. Start Development Server

```bash
# Start the development server
npm run dev

# Start the documentation site
npm run docs:dev
```

## Contributing Guidelines

### Branch Naming

Use descriptive branch names following this pattern:

- `feature/add-new-hook` - New features
- `fix/memory-leak-issue` - Bug fixes
- `docs/update-api-reference` - Documentation updates
- `refactor/optimize-rendering` - Code refactoring
- `test/add-integration-tests` - Test additions

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(hooks): add useAsyncRefraction hook

Add new hook for handling asynchronous state updates with built-in
loading and error states.

Closes #123
```

```
fix(lens): resolve memory leak in effect cleanup

Effects were not being properly cleaned up when components unmounted,
causing memory leaks in long-running applications.

Fixes #456
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Fix linting issues
npm run lint:fix
```

**Key guidelines:**
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use meaningful variable names

### Testing

All contributions must include appropriate tests:

#### Unit Tests
```javascript
// src/hooks/__tests__/useRefraction.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useRefraction } from '../useRefraction';

describe('useRefraction', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useRefraction(0));
    expect(result.current.value).toBe(0);
  });

  it('should update value when set is called', () => {
    const { result } = renderHook(() => useRefraction(0));
    
    act(() => {
      result.current.set(5);
    });
    
    expect(result.current.value).toBe(5);
  });
});
```

#### Integration Tests
```javascript
// src/__tests__/integration/counter.test.js
import { render, fireEvent, screen } from '@testing-library/react';
import { createApp } from '../../core/createApp';
import Counter from '../fixtures/Counter';

describe('Counter Integration', () => {
  it('should increment counter when button is clicked', () => {
    const app = createApp();
    render(<Counter />, { wrapper: app.Provider });
    
    const button = screen.getByText('+');
    const display = screen.getByTestId('counter-display');
    
    expect(display).toHaveTextContent('0');
    
    fireEvent.click(button);
    
    expect(display).toHaveTextContent('1');
  });
});
```

#### Performance Tests
```javascript
// src/__tests__/performance/rendering.test.js
import { measurePerformance } from '../utils/performance';
import { createComponent } from '../../core/createComponent';

describe('Rendering Performance', () => {
  it('should render 1000 components in under 100ms', async () => {
    const Component = createComponent(() => <div>Test</div>);
    
    const duration = await measurePerformance(() => {
      // Render 1000 components
      for (let i = 0; i < 1000; i++) {
        render(<Component key={i} />);
      }
    });
    
    expect(duration).toBeLessThan(100);
  });
});
```

### Documentation

When contributing code, also update relevant documentation:

#### API Documentation
- Update JSDoc comments for public APIs
- Add examples for new features
- Update type definitions

#### User Documentation
- Add new features to appropriate guides
- Update tutorials if APIs change
- Add migration notes for breaking changes

#### Examples
```javascript
/**
 * Creates a reactive state container with automatic dependency tracking.
 * 
 * @template T The type of the state value
 * @param {T} initialValue - The initial state value
 * @param {RefractionOptions<T>} [options] - Configuration options
 * @returns {Refraction<T>} A refraction instance
 * 
 * @example
 * ```javascript
 * const count = useRefraction(0);
 * 
 * // Read the current value
 * console.log(count.value); // 0
 * 
 * // Update the value
 * count.set(5);
 * 
 * // Update with a function
 * count.set(prev => prev + 1);
 * ```
 * 
 * @example
 * ```javascript
 * // With validation
 * const age = useRefraction(0, {
 *   validate: (value) => value >= 0 && value <= 150,
 *   onValidationError: (error) => console.warn(error)
 * });
 * ```
 */
export function useRefraction<T>(
  initialValue: T,
  options?: RefractionOptions<T>
): Refraction<T> {
  // Implementation...
}
```

## Pull Request Process

### 1. Prepare Your Changes

```bash
# Create a new branch
git checkout -b feature/my-new-feature

# Make your changes
# ... code, test, document ...

# Commit your changes
git add .
git commit -m "feat: add my new feature"
```

### 2. Update Your Branch

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on the latest main
git rebase upstream/main

# Push your branch
git push origin feature/my-new-feature
```

### 3. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Fill out the PR template completely
4. Link related issues using keywords (e.g., "Closes #123")

### 4. PR Template

```markdown
## Description
Brief description of the changes and their purpose.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Performance tests added/updated (if applicable)
- [ ] Manual testing completed

## Documentation
- [ ] API documentation updated
- [ ] User guides updated
- [ ] Examples added/updated
- [ ] Migration guide updated (for breaking changes)

## Checklist
- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Tests pass locally
- [ ] No new linting errors
- [ ] Backwards compatibility maintained (or breaking change documented)

## Screenshots (if applicable)
Add screenshots or GIFs demonstrating the changes.

## Additional Notes
Any additional information that reviewers should know.
```

### 5. Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and checks
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]
 - Refract Version [e.g. 1.2.3]

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Documentation

### Writing Guidelines

- Use clear, concise language
- Include practical examples
- Follow the existing documentation structure
- Test all code examples
- Use proper markdown formatting

### Documentation Types

#### API Reference
- Complete parameter descriptions
- Return value documentation
- Usage examples
- Error conditions
- Performance considerations

#### Tutorials
- Step-by-step instructions
- Complete working examples
- Explanation of concepts
- Common pitfalls and solutions

#### Guides
- Best practices
- Advanced patterns
- Performance optimization
- Migration guides

### Local Documentation Development

```bash
# Start documentation server
npm run docs:dev

# Build documentation
npm run docs:build

# Test documentation links
npm run docs:test
```

## Community

### Communication Channels

- **Discord**: [Join our Discord server](https://discord.gg/refract)
- **GitHub Discussions**: For questions and community discussions
- **Twitter**: [@RefractJS](https://twitter.com/RefractJS) for updates
- **Stack Overflow**: Tag questions with `refract-js`

### Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Ask in Discord #help channel
4. Create a GitHub discussion
5. Open a GitHub issue (for bugs)

### Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and experiences
- Provide constructive feedback
- Follow the code of conduct

## Recognition

Contributors are recognized in several ways:

- **Contributors page**: Listed on our website
- **Release notes**: Mentioned in release announcements
- **Hall of fame**: Special recognition for significant contributions
- **Swag**: Stickers and other goodies for active contributors

## License

By contributing to Refract, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have any questions about contributing, please:

1. Check this guide first
2. Search existing GitHub issues and discussions
3. Ask in our Discord #contributors channel
4. Create a GitHub discussion

Thank you for contributing to Refract! 🎉
