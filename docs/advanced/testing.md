---
id: testing
title: Testing Guide
---

# Testing in Refract

This guide covers best practices and utilities for testing Refract applications.

## Table of Contents
- [Setup](#setup)
- [Testing Components](#testing-components)
- [Testing State Management](#testing-state-management)
- [Testing Effects](#testing-effects)
- [Best Practices](#best-practices)

## Setup

First, ensure you have the necessary testing libraries installed:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest @testing-library/user-event
```

## Testing Components

### Basic Component Test

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello, World!')).toBeInTheDocument();
});
```

### Testing with Context

```javascript
test('renders with context', () => {
  render(
    <MyContext.Provider value={{ value: 'test' }}>
      <MyComponent />
    </MyContext.Provider>
  );
  // Your assertions
});
```

## Testing State Management

### Testing State Updates

```javascript
import { render, fireEvent } from '@testing-library/react';

test('updates state on click', () => {
  const { getByText } = render(<Counter />);
  const button = getByText('Increment');
  fireEvent.click(button);
  expect(getByText('Count: 1')).toBeInTheDocument();
});
```

## Testing Effects

### Mocking API Calls

```javascript
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

test('fetches data on mount', async () => {
  mock.onGet('/api/data').reply(200, { data: 'test' });
  
  const { findByText } = render(<DataFetcher />);
  
  await waitFor(() => {
    expect(findByText('test')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the user sees and does
   - Avoid testing implementation details

2. **Use Test IDs Sparingly**
   - Prefer text content and ARIA roles for queries
   - Use test IDs as a last resort

3. **Keep Tests Isolated**
   - Each test should be independent
   - Reset mocks between tests

4. **Test Edge Cases**
   - Empty states
   - Loading states
   - Error states

## Tools

- Jest
- React Testing Library
- MSW (Mock Service Worker)
- Jest DOM

## Related

- [Performance Optimization](./performance)
- [API Reference](/docs/api)
