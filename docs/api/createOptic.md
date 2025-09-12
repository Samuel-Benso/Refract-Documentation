---
id: createOptic
title: createOptic
---

`createOptic` is a utility function that helps you create reactive references to nested state values in Refract.

## Import

```javascript
import { createOptic } from 'refract';
```

## Usage

```javascript
const state = {
  user: {
    name: 'John',
    age: 30,
    preferences: {
      theme: 'dark',
      notifications: true
    }
  }
};

const nameOptic = createOptic('user.name');
const themeOptic = createOptic('user.preferences.theme');

// Get values
console.log(nameOptic.get(state)); // 'John'
console.log(themeOptic.get(state)); // 'dark'

// Set values
const newState = nameOptic.set('Jane')(state);
console.log(newState.user.name); // 'Jane'
```

## API Reference

### `createOptic(path: string): Optic`

Creates an optic that can get and set values at the specified path.

#### Parameters
- `path`: A dot-separated string representing the path to the value in the state object.

#### Returns
An `Optic` object with `get` and `set` methods.

## Related

- [useOptic](./useOptic)
- [Lens API](../concepts/lenses)
