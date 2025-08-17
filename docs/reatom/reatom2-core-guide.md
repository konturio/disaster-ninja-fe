# Reatom 2 Core Guide

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
  - [Context](#context)
  - [Atoms](#atoms)
  - [Actions](#actions)
- [API Reference](#api-reference)
  - [Core API](#core-api)
  - [Track Interface](#track-interface)
  - [Primitive API](#primitive-api)
  - [Async API](#async-api)
  - [Utility API](#utility-api)
- [Dependency Patterns](#dependency-patterns)
  - [String-based Dependencies](#string-based-dependencies)
  - [Action Dependencies](#action-dependencies)
  - [V3 Integration](#v3-integration)
- [Async Patterns](#async-patterns)
  - [createAsyncAtom](#createasyncatom)
  - [State Management](#state-management)
  - [Async Dependency Patterns](#async-dependency-patterns)
- [V2/V3 Bridge](#v2v3-bridge)
  - [v3toV2](#v3tov2)
  - [v3ActionToV2](#v3actiontov2)
- [Common Patterns](#common-patterns)
  - [State Management](#state-management-1)
  - [Action Handling](#action-handling)
  - [Side Effects](#side-effects)
  - [V2/V3 Integration](#v2v3-integration)

## Overview

Reatom 2 is a state management library with a unique dependency-based architecture. It uses **string-based dependencies** and **track methods** for state management, with built-in **V3 integration** for migration support.

## Core Concepts

### Context

Reatom 2 uses a **track object** passed to reducers for state management and side effects.

```typescript
// Track object provides all atom interaction methods
const myAtom = createAtom(
  { counterAtom, increment: (n: number) => n },
  ({ get, onAction, schedule }, state = 0) => {
    // Track methods for state management
    return state;
  },
);
```

### Atoms

Atoms are created with dependencies, reducer, and optional configuration.

```typescript
import { createAtom } from '~utils/atoms';

// Basic atom with dependencies and actions
const counterAtom = createAtom(
  {
    // Dependencies (other atoms)
    otherAtom: someAtom,

    // Actions (payload mappers)
    increment: (amount: number) => amount,
    reset: () => null,
  },
  // Reducer with track methods
  ({ get, onAction, onChange, schedule }, state = 0) => {
    // State management logic
    return state;
  },
  // Optional atom ID
  'counterAtom',
);
```

### Actions

Actions are defined in dependencies and handled in reducers.

```typescript
// Action definition in dependencies
{
  increment: (amount: number) => amount,  // Action with payload
  reset: () => null,                     // Action without payload
}

// Action handling in reducer
onAction("increment", (amount) => {
  state += amount;
});

onAction("reset", () => {
  state = 0;
});
```

## API Reference

### Core API

#### `createAtom(deps, reducer, options?)`

Creates atom with dependencies and reducer function.

```typescript
function createAtom<State, Deps>(
  deps: {
    atomDeps?: { [key: string]: Atom }; // Other atoms to read/subscribe
    actionMappers?: { [key: string]: Function }; // Convert params to action payload
    actionCreators?: { [key: string]: Action }; // Direct action creators
  },
  reducer: (track: Track, state?: State) => State,
  options?: {
    // AtomOptions
    id?: string; // Atom identifier
    decorators?: AtomDecorator[]; // Transform atom behavior
    store?: Store; // Custom store implementation
  },
): Atom<State> & ActionCreators;
```

**Dependencies signature**: `{ [key: string]: Atom | Function }`

- `atomDeps`: Other atoms to read/subscribe to
- `actionMappers`: Functions that convert parameters to action payloads
- `actionCreators`: Direct action creators

**Reducer signature**: `(track: Track, state?: State) => State`

- `track`: Track object with all interaction methods
- `state`: Current atom state (optional for initial state)

### Track Interface

The `Track` object provides all methods for atom interaction, dependency management, and side effects.

```typescript
interface Track {
  // Read dependency state with subscription management
  // - Outside handlers: READS + SUBSCRIBES
  // - Inside onAction/onChange: Only READS
  // - In async (schedule): Throws "Outdated track call"
  get(depsKey: string): any;

  // Handle specific action with payload
  // - Runs synchronously when action dispatched
  // - get() inside only READS state
  onAction(type: string, cb: (payload: any) => void);

  // React to state changes of dependency atom
  // - Runs after state updates
  // - get() inside only READS state
  onChange(atomKey: string, cb: (newState: any, prevState: any) => void);

  // Queue side effect for execution after computations
  // - Only place to get dispatch function
  // - Runs asynchronously after all atom updates
  // - Cannot use get() inside (will throw)
  schedule(effect: (dispatch: Dispatch, ctx: any) => void);

  // Create action from dependency mapper
  create(actionKey: string, ...args: any[]): Action;

  // Run callback only on first reducer execution
  onInit(cb: () => void);

  // Read external atom state without subscription
  getUnlistedState(atom: Atom): any;

  // V3 Integration context
  // - Allows interaction with Reatom v3 atoms
  // - spy() reads v3 atom state without subscription
  v3ctx: {
    spy(atom: V3Atom): any;
  };
}
```

#### `track.get(depsKey: string)`

Reads dependency state with subscription management.

```typescript
function track.get(depsKey: string): any
```

**Important**: Uses string literals that must match dependency key names.

- **Outside handlers**: READS + SUBSCRIBES (creates reactive dependency)
- **Inside onAction/onChange**: Only READS (no subscription)
- **In async (schedule)**: Throws "Outdated track call"

**Usage**:

```typescript
const myAtom = createAtom({ counter: counterAtom }, ({ get }) => {
  const value = get('counter'); // Must use string literal
  return value * 2;
});
```

#### `track.onAction(type: string, callback)`

Handles specific action with payload.

```typescript
function track.onAction(type: string, callback: (payload: any) => void): void
```

**Callback signature**: `(payload: any) => void`

- Runs synchronously when action dispatched
- `get()` inside only READS state (no subscription)

**Usage**:

```typescript
onAction('increment', (amount) => {
  state += amount;
});
```

#### `track.onChange(atomKey: string, callback)`

Reacts to state changes of dependency atom.

```typescript
function track.onChange(atomKey: string, callback: (newState: any, prevState: any) => void): void
```

**Callback signature**: `(newState: any, prevState: any) => void`

- Runs after state updates
- `get()` inside only READS state (no subscription)

**Usage**:

```typescript
onChange('counter', (newState, prevState) => {
  console.log(`Counter changed from ${prevState} to ${newState}`);
});
```

#### `track.schedule(effect)`

Queues side effect for execution after computations.

```typescript
function track.schedule(effect: (dispatch: Dispatch, ctx: any) => void): void
```

**Effect signature**: `(dispatch: Dispatch, ctx: any) => void`

- Only place to get dispatch function
- Runs asynchronously after all atom updates
- Cannot use `get()` inside (will throw "Outdated track call")

**Usage**:

```typescript
schedule(async (dispatch) => {
  const data = await fetch('/api/data');
  dispatch(create('setData', data));
});
```

#### `track.create(actionKey: string, ...args)`

Creates action from dependency mapper.

```typescript
function track.create(actionKey: string, ...args: any[]): Action
```

**Usage**:

```typescript
const action = create('increment', 5);
dispatch(action);
```

#### `track.onInit(callback)`

Runs callback only on first reducer execution.

```typescript
function track.onInit(callback: () => void): void
```

**Usage**:

```typescript
onInit(() => {
  console.log('Atom initialized');
  // Setup logic here
});
```

#### `track.getUnlistedState(atom)`

Reads external atom state without subscription.

```typescript
function track.getUnlistedState(atom: Atom): any
```

**Important**: Accepts atom instance, not atom ID.

**Usage**:

```typescript
// Access atom not listed in dependencies
const externalState = getUnlistedState(someOtherAtom);
```

#### `track.v3ctx`

V3 Integration context for interacting with v3 atoms.

```typescript
track.v3ctx: {
  spy(atom: V3Atom): any  // Reads v3 atom state without subscription
}
```

**Important**: `v3ctx.spy()` does NOT create subscription.

**Usage**:

```typescript
// Access v3 atom state without subscription
const v3State = v3ctx.spy(someV3Atom);
```

## Complete Track Usage Example

```typescript
const myAtom = createAtom(
  {
    // Dependencies
    counter: counterAtom,
    increment: (amount: number) => amount,
    reset: () => null,
  },
  (
    { get, onAction, onChange, schedule, create, onInit, getUnlistedState, v3ctx },
    state = 0,
  ) => {
    // Read dependency with subscription
    const counter = get('counter');

    // Handle actions
    onAction('increment', (amount) => {
      state += amount;
    });

    onAction('reset', () => {
      state = 0;
    });

    // React to changes
    onChange('counter', (newState, prevState) => {
      console.log(`Counter changed from ${prevState} to ${newState}`);
    });

    // Schedule side effects
    schedule(async (dispatch) => {
      await someAsyncOperation();
      dispatch(create('reset'));
    });

    // Initialize once
    onInit(() => {
      console.log('Atom initialized');
    });

    // Access external state
    const externalState = getUnlistedState(someOtherAtom);

    // V3 integration (no subscription)
    const v3State = v3ctx.spy(someV3Atom);

    return state;
  },
  'myAtom',
);
```

### Primitive API

#### `createBooleanAtom(initial, id?)`

Creates boolean atom with boolean-specific methods.

```typescript
function createBooleanAtom(
  initial: boolean,
  id?: string,
): {
  getState(): boolean; // Current state
  toggle(): Action; // Flip current state
  setTrue(): Action; // Set to true
  setFalse(): Action; // Set to false
  change(fn: (state: boolean) => boolean): Action; // Custom update
};
```

#### `createStringAtom(initial, id?)`

Creates string atom with string-specific methods.

```typescript
function createStringAtom<T extends string>(
  initial: T,
  id?: string,
): {
  getState(): T; // Current state
  change(value: T): Action; // Update value
};
```

#### `createNumberAtom(initial, id?)`

Creates number atom with number-specific methods.

```typescript
function createNumberAtom(
  initial: number,
  id?: string,
): {
  getState(): number; // Current state
  change(n: number): Action; // Set specific value
  increment(n: number = 1): Action; // Add n (default: 1)
  decrement(n: number = 1): Action; // Subtract n (default: 1)
};
```

#### `createEnumAtom(variants, options?)`

Creates enum atom with variant-specific actions.

```typescript
function createEnumAtom<T extends string[]>(
  variants: T,
  options?: {
    // EnumOptions
    format?: 'camelCase' | 'snake_case'; // Action creator naming
    initial?: T[number]; // Initial state
  },
): {
  getState(): T[number]; // Current state
  enum: Record<T[number], T[number]>; // Static enum object
  set [Variant](): Action; // Action creator per variant
};
```

#### Collection Types

```typescript
// Map atom
function createMapAtom<K, V>(
  initial?: Map<K, V>,
): {
  getState(): Map<K, V>; // Current state
  set(key: K, value: V): Action; // Add/update entry
  delete(key: K): Action; // Remove entry
  clear(): Action; // Remove all entries
};

// Set atom
function createSetAtom<T>(initial?: Set<T>): {
  getState(): Set<T>; // Current state
  add(item: T): Action; // Add item
  delete(item: T): Action; // Remove item
  clear(): Action; // Remove all items
};
```

### Async API

#### `createAsyncAtom(deps, fetcher, name, options?)`

Creates async atom for handling async operations.

```typescript
function createAsyncAtom<D extends AtomBinded, F extends Fetcher>(
  depsAtom: D | null,
  fetcher: F,
  name: string,
  options?: {
    // AsyncAtomOptions
    inheritState?: boolean; // Inherit loading/error states from deps
    auto?: boolean; // Auto-fetch on deps change (default: true)
    verbose?: boolean; // Enable debug logging
    store?: Store; // Custom store implementation
  },
): AtomSelfBinded<AsyncAtomState, AsyncAtomDeps>;
```

**Fetcher signature**: `(params: I, abortController: AbortController) => Promise<O>`

- `params`: Parameters from dependencies
- `abortController`: For request cancellation
- **Returns**: Promise with response

**State shape**:

```typescript
interface AsyncAtomState<P, D> {
  loading: boolean;
  error: string | null;
  data: D | null;
  lastParams: P | null; // Params used for last request
  dirty: boolean; // Has this been requested?
}
```

**Available actions**:

- `request(params?)` - Trigger fetch with parameters
- `refetch()` - Retry with last parameters
- `cancel()` - Cancel current request

### Utility API

#### `combineAtoms(shape)`

Combines multiple atoms into one.

```typescript
function combineAtoms<T extends AtomsMap>(
  shape: T,
): AtomBinded<{ [key in keyof T]: T[key] extends Atom<infer S> ? S : unknown }>;
```

#### `combineAsyncAtoms(atoms)`

Combines multiple async atoms, preserving loading states.

```typescript
function combineAsyncAtoms(atoms: AsyncAtom[]): CombinedAsyncAtom;
```

#### `forceRun(atoms)`

Forces atoms to run even without subscribers.

```typescript
function forceRun(atoms: AtomWithSubscribe | AtomWithSubscribe[]): () => void;
```

## Dependency Patterns

### String-based Dependencies

**IMPORTANT**: In v2, `get()` accepts string literals that must match dependency key names.

```typescript
// ✅ Correct - use string literal matching dependency key
const myAtom = createAtom(
  {
    counter: counterAtom, // Dependency key is 'counter'
  },
  ({ get }) => {
    const value = get('counter'); // Must use "counter", not counterAtom
    return value * 2;
  },
);

// ❌ Wrong - this will not work in v2
const value = get(counterAtom); // Don't pass atom instance in v2
```

### Action Dependencies

Actions are defined in dependencies and handled in reducers.

```typescript
const counterAtom = createAtom(
  {
    // Action definitions
    increment: (amount: number) => amount,
    reset: () => null,
  },
  ({ onAction }, state = 0) => {
    // Action handling
    onAction('increment', (amount) => {
      state += amount;
    });

    onAction('reset', () => {
      state = 0;
    });

    return state;
  },
);
```

### V3 Integration

Use `v3ctx` to interact with v3 atoms.

```typescript
const bridgeAtom = createAtom({}, ({ v3ctx }, state = null) => {
  // Access v3 atom state without subscription
  const v3State = v3ctx.spy(someV3Atom);
  return v3State;
});
```

## Async Patterns

### createAsyncAtom

`createAsyncAtom` provides async operations with built-in abort control.

```typescript
import { createAsyncAtom } from '~utils/atoms';

// Simple async atom
const userResource = createAsyncAtom(
  null, // No dependencies
  async () => {
    const response = await fetch('/api/user');
    return response.json();
  },
  'userResource',
);

// Async atom with dependencies
const userPostsResource = createAsyncAtom(
  userResource, // Depends on user data
  async (userData) => {
    const response = await fetch(`/api/users/${userData.id}/posts`);
    return response.json();
  },
  'userPostsResource',
  { inheritState: true }, // Inherit loading/error from userResource
);
```

### State Management

Async atoms provide complete state management.

```typescript
// Get current state
const state = userResource.getState();
// { loading: false, data: {...}, error: null, lastParams: null, dirty: true }

// Subscribe to changes
userResource.subscribe((state) => {
  if (state.loading) console.log('Loading...');
  if (state.error) console.error('Error:', state.error);
  if (state.data) console.log('Data:', state.data);
});

// Trigger actions
userResource.request.dispatch(); // Fetch with no params
userResource.request.dispatch({ id: 1 }); // Fetch with params
userResource.refetch.dispatch(); // Retry with last params
userResource.cancel.dispatch(); // Cancel current request
```

### Async Dependency Patterns

#### Direct Atom Dependency

```typescript
const cityAtom = createAtom('London', 'cityAtom');
const weatherByCityAtom = createAsyncAtom(
  cityAtom,
  async (city: string) => {
    const response = await fetch(`/weather/${city}`);
    return response.json();
  },
  'weatherByCityAtom',
);
```

#### Async Atom Dependency

```typescript
const userAtom = createAsyncAtom(
  null,
  async () => fetch('/user').then((r) => r.json()),
  'userAtom',
);

const userPreferencesAtom = createAsyncAtom(
  userAtom,
  async (userData) => {
    const response = await fetch(`/preferences/${userData.id}`);
    return response.json();
  },
  'userPreferencesAtom',
  { inheritState: true }, // Inherit loading/error states
);
```

#### Combined Atoms Dependency

```typescript
const configAtom = createAtom({ units: 'C' }, 'configAtom');
const locationAtom = createAtom({ lat: 0, lon: 0 }, 'locationAtom');

const weatherWithConfigAtom = createAsyncAtom(
  combineAtoms({
    config: configAtom,
    location: locationAtom,
  }),
  async (deps) => {
    const { config, location } = deps;
    const response = await fetch(
      `/weather?units=${config.units}&lat=${location.lat}&lon=${location.lon}`,
    );
    return response.json();
  },
  'weatherWithConfigAtom',
);
```

## V2/V3 Bridge

### v3toV2

Converts Reatom v3 atom to v2 for compatibility.

```typescript
import { v3toV2 } from '~utils/atoms/v3tov2';

function v3toV2<State, Deps, V3Actions>(
  v3atom: v3.Atom<State>,
  v3Actions?: V3Actions,
  store?: Store,
): AtomSelfBinded<State, Tov2Actions<V3Actions>>;
```

Notes:

- Each provided v3 action becomes a v2 action creator that:
  - accepts a single payload argument (no ctx). If you need multiple values, wrap them into a single object payload
  - exposes a `.dispatch(payload?)` helper bound to the provided `store`
  - has `type` equal to the v3 action name (or an auto-generated name when absent)
- The returned v2 atom is bound to the same `store` (defaults to global store) and exposes the underlying v3 atom on `v2Atom.v3atom` for advanced integration.
- Bridge is a v2 facade over a v3 atom:
  - v2 action mappers are NOT called; only the first argument is forwarded as `payload`
  - v2 reducer / `onAction` flow is NOT executed for bridged actions (the reducer is a no-op)
  - Do not rely on multi-argument mappers or `create()` → `onAction` chains with bridged actions

**Usage**:

```typescript
// Create v3 atom
const v3Atom = atom(0, 'counter');
const incrementAction = action((ctx, amount: number = 1) => {
  v3Atom(ctx, ctx.get(v3Atom) + amount);
}, 'increment');

// Convert to v2
const v2Atom = v3toV2(v3Atom, {
  increment: incrementAction,
});

// Use v2 API
v2Atom.increment.dispatch(2); // payload is forwarded to the v3 action as its payload
const state = v2Atom.getState();
```

Multiple values:

```typescript
// Prefer a single object payload when multiple values are needed
const setRange = action((ctx, payload: { min: number; max: number }) => {
  const next = Math.max(payload.min, Math.min(payload.max, ctx.get(v3Atom)));
  v3Atom(ctx, next);
}, 'setRange');

const v2AtomWithRange = v3toV2(v3Atom, { setRange });
v2AtomWithRange.setRange.dispatch({ min: 1, max: 10 });
```

Warning: Only the first argument is forwarded through the bridge. Do not rely on multi-parameter action mappers; wrap data into a single object payload.

### v3ActionToV2

Converts Reatom v3 action to v2 action.

```typescript
import { v3ActionToV2 } from '~utils/atoms/v3tov2';

function v3ActionToV2<Payload>(
  v3action: v3.Action,
  payload: Payload,
  type: string,
): Action;
```

**Usage**:

```typescript
const v3Action = action((ctx, value: string) => {
  // v3 action logic
}, 'updateValue');

const v2Action = v3ActionToV2(v3Action, 'new value', 'UPDATE_VALUE');
store.dispatch(v2Action);
```

Action shape:

- `type: string` — v2 action type
- `payload: unknown` — payload passed to the v3 action as its second argument
- `v3action: v3.Action` — original v3 action reference

## Common Patterns

### State Management

Complete state management with proper immutability.

```typescript
const counterAtom = createAtom(
  {
    increment: (amount: number) => amount,
    reset: () => null,
  },
  ({ onAction }, state = 0) => {
    // Action handling with state mutation
    onAction('increment', (amount) => {
      state += amount; // Direct mutation is allowed in v2
    });

    onAction('reset', () => {
      state = 0;
    });

    return state; // Return modified state
  },
  'counterAtom',
);
```

### Action Handling

Proper action definition and handling patterns.

```typescript
const userAtom = createAtom(
  {
    // Action definitions with typed payloads
    setUser: (user: User) => user,
    updateName: (name: string) => name,
    clearUser: () => null,
  },
  ({ onAction }, state = null) => {
    // Typed action handling
    onAction('setUser', (user: User) => {
      state = user;
    });

    onAction('updateName', (name: string) => {
      if (state) {
        state = { ...state, name };
      }
    });

    onAction('clearUser', () => {
      state = null;
    });

    return state;
  },
);
```

### Side Effects

Proper side effect management using `schedule`.

```typescript
const dataAtom = createAtom(
  {
    fetchData: (id: string) => id,
  },
  ({ onAction, schedule }, state = null) => {
    onAction('fetchData', (id) => {
      // Schedule async operation
      schedule(async (dispatch) => {
        try {
          const response = await fetch(`/api/data/${id}`);
          const data = await response.json();

          // Dispatch success action
          dispatch(create('setData', data));
        } catch (error) {
          // Dispatch error action
          dispatch(create('setError', error.message));
        }
      });
    });

    return state;
  },
);
```

### V2/V3 Integration

Seamless integration between v2 and v3 atoms.

```typescript
const bridgeAtom = createAtom({}, ({ v3ctx, schedule }, state = null) => {
  // Access v3 atom state
  const v3State = v3ctx.spy(someV3Atom);

  // React to v3 changes
  schedule((dispatch) => {
    if (v3State !== state) {
      dispatch(create('updateState', v3State));
    }
  });

  return state;
});
```
