# Reatom 3 Core Guide

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
  - [Context](#context)
  - [Atoms](#atoms)
  - [Actions](#actions)
- [API Reference](#api-reference)
  - [Context API](#context-api)
  - [Atom API](#atom-api)
  - [Action API](#action-api)
  - [Async API](#async-api)
  - [Primitive API](#primitive-api)
  - [React API](#react-api)

## Overview

Reatom 3 is a state management library built on three core concepts: **atoms** for data references, **actions** for logic processing, and **context** for system isolation.

## Core Concepts

### Context

Context provides state isolation and transaction management.

```typescript
import { createCtx } from '@reatom/core';

// Create context for state isolation
export const ctx = createCtx();
```

### Atoms

Atoms are reactive data containers that can hold state and compute derived values.

```typescript
import { atom } from '@reatom/core';

// Basic atom with initial state
const counterAtom = atom(0);

// Computed atom with dependencies
const doubledAtom = atom((ctx) => {
  const value = ctx.spy(counterAtom);
  return value * 2;
});

// Atom with reducer for state updates
const counterWithReducer = atom(0, (ctx, state) => {
  return state + 1;
});
```

### Actions

Actions handle side effects and state mutations.

```typescript
import { action } from '@reatom/core';

// Simple action
const increment = action((ctx) => {
  counterAtom(ctx, ctx.get(counterAtom) + 1);
});

// Action with payload
const setValue = action((ctx, value: number) => {
  counterAtom(ctx, value);
});

// Async action with side effects
const fetchData = action(async (ctx, id: string) => {
  const data = await ctx.schedule(() => fetch(`/api/data/${id}`).then((r) => r.json()));
  dataAtom(ctx, data);
});
```

## API Reference

### Context API

#### `createCtx()`

Creates a new context instance for state isolation.

```typescript
function createCtx(): Ctx;
```

#### `ctx.get(atom)`

Gets current atom value without creating subscription.

```typescript
function ctx.get<T>(atom: Atom<T>): T
```

**Note**: Does not create subscription, atom won't recompute when this atom changes.

#### `ctx.spy(atom)`

Creates subscription and returns current atom value.

```typescript
function ctx.spy<T>(atom: Atom<T>): T
```

**Note**: Creates subscription, atom will recompute when this atom changes.

#### `ctx.subscribe(atom, callback)`

Subscribes to atom changes.

```typescript
function ctx.subscribe<T>(atom: Atom<T>, callback: (value: T) => void): Unsubscribe
```

**Returns**: Unsubscribe function to remove subscription.

#### `ctx.schedule(callback)`

Schedules side effects for execution after transaction.

```typescript
function ctx.schedule<T>(callback: () => T | Promise<T>): Promise<T>
```

**Note**: Side effects are executed after all state updates in current transaction.

#### `batch(ctx, callback)`

Batches multiple state updates into single transaction.

```typescript
function batch(ctx: Ctx, callback: () => void): void;
```

**Note**: All updates inside callback are applied atomically.

### Atom API

#### `atom(initialState)`

Creates basic atom with initial state.

```typescript
function atom<T>(initialState: T): AtomMut<T>;
```

#### `atom(initialState, reducer)`

Creates atom with reducer function for state updates.

```typescript
function atom<T>(initialState: T, reducer: (ctx: Ctx, state: T) => T): AtomMut<T>;
```

**Reducer signature**: `(ctx: Ctx, state: T) => T`

- `ctx`: Context for accessing other atoms
- `state`: Current atom state
- **Returns**: New state value

**Note**: Reducer is called on every atom access, not just updates.

#### `atom(computed)`

Creates computed atom with dependencies.

```typescript
function atom<T>(computed: (ctx: Ctx) => T): Atom<T>;
```

**Computed signature**: `(ctx: Ctx) => T`

- `ctx`: Context for accessing other atoms
- **Returns**: Computed value

**Note**: Recomputes when any `ctx.spy()` dependency changes.

#### `atom.onChange(callback)`

Reacts to atom changes with callback.

```typescript
function atom.onChange(callback: (ctx: Ctx, value: T) => void): void
```

**Callback signature**: `(ctx: Ctx, value: T) => void`

- `ctx`: Context for side effects
- `value`: New atom value

### Action API

#### `action(handler)`

Creates action with handler function.

```typescript
function action<Params extends any[]>(
  handler: (ctx: Ctx, ...params: Params) => void | Promise<void>,
): Action<Params, void>;
```

**Handler signature**: `(ctx: Ctx, ...params: Params) => void | Promise<void>`

- `ctx`: Context for state updates
- `params`: Action parameters
- **Returns**: void or Promise<void>

#### `action(handler, name)`

Creates named action for debugging.

```typescript
function action<Params extends any[]>(
  handler: (ctx: Ctx, ...params: Params) => void | Promise<void>,
  name: string,
): Action<Params, void>;
```

#### `action.onCall(callback)`

Reacts to action calls.

```typescript
function action.onCall(callback: (ctx: Ctx, params: Params) => void): void
```

**Callback signature**: `(ctx: Ctx, params: Params) => void`

- `ctx`: Context for side effects
- `params`: Action call parameters

### Async API

#### `reatomAsync(effect, options?)`

Creates async action with abort control.

```typescript
function reatomAsync<Params extends any[], Response>(
  effect: (ctx: AsyncCtx, ...params: Params) => Promise<Response>,
  options?: // AsyncOptions<Params, Response> | string
  | {
        name?: string;
        onEffect?: (
          ctx: Ctx,
          params: Params,
          promise: ControlledPromise<Response>,
        ) => void;
        onFulfill?: (ctx: Ctx, response: Response) => void;
        onReject?: (ctx: Ctx, error: unknown) => void;
        onSettle?: (ctx: Ctx) => void;
      }
    | string,
): AsyncAction<Params, Response>;
```

**Effect signature**: `(ctx: AsyncCtx, ...params: Params) => Promise<Response>`

- `ctx`: Async context with `controller.signal` for abort control
- `params`: Action parameters
- **Returns**: Promise with response

**Returns**: `AsyncAction` with additional properties:

- `pendingAtom`: Atom<number> - tracks pending requests count
- `onFulfill`: Action<[Response], Response>
- `onReject`: Action<[unknown], unknown>
- `onSettle`: Action<[], void>

#### `reatomResource(effect)`

Creates resource with reactive dependencies.

```typescript
function reatomResource<Response>(
  effect: (ctx: Ctx) => Promise<Response>,
): AsyncAction<[], Response>;
```

**Effect signature**: `(ctx: Ctx) => Promise<Response>`

- `ctx`: Context for accessing reactive dependencies
- **Returns**: Promise with response

**Note**: Auto-recomputes when `ctx.spy()` dependencies change.

#### Resource Operators

##### `withDataAtom(initialState)`

Adds data state management.

```typescript
function withDataAtom<T>(
  initialState: T,
): (action: AsyncAction) => AsyncAction & { dataAtom: AtomMut<T> };
```

**Returns**: Enhanced action with `dataAtom` property.

##### `withErrorAtom(parseError?)`

Adds error state management.

```typescript
function withErrorAtom<E = Error>(
  parseError?: (ctx: Ctx, error: unknown) => E,
): (action: AsyncAction) => AsyncAction & { errorAtom: AtomMut<E> };
```

**parseError signature**: `(ctx: Ctx, error: unknown) => E`

- Transforms raw errors into typed error state

##### `withCache(options)`

Adds caching capabilities.

```typescript
function withCache(options?: {
  // CacheOptions
  staleTime?: number; // Time before data is considered stale (ms)
  cacheTime?: number; // Time before cache entry is removed (ms)
  size?: number; // Maximum number of cached entries
  swr?: boolean; // Enable stale-while-revalidate
  ignoreAbort?: boolean; // Keep cache on abort
}): (action: AsyncAction) => AsyncAction & { cacheAtom: CacheAtom };
```

##### `withRetry(options)`

Adds retry logic.

````typescript
function withRetry(options?: { // RetryOptions
  fallbackParams?: any[]
  onReject?: (ctx: Ctx, error: unknown, retries: number) => void | number
}): (action: AsyncAction) => AsyncAction & { retry: Action<[after?: number], any> }

**onReject signature**: `(ctx: Ctx, error: unknown, retries: number) => void | number`
- Return number (ms) to retry after, undefined to stop retrying

##### `withAbort(options)`

Adds abort control.

```typescript
function withAbort(options?: {  // AbortOptions
  strategy?: 'none' | 'last-in-win' | 'first-in-win'
}): (action: AsyncAction) => AsyncAction & { abort: Action<[reason?: string], void> }
````

### Primitive API

#### `stringAtom(initialValue)`

Creates string atom with string-specific methods.

```typescript
function stringAtom(initialValue: string): AtomMut<string>;
```

**Usage**:

```typescript
const nameAtom = stringAtom('John');
nameAtom(ctx, 'Jane'); // Direct assignment
nameAtom(ctx, (prev) => prev + ' Doe'); // Functional update
```

#### `numberAtom(initialValue)`

Creates number atom with number-specific methods.

```typescript
function numberAtom(initialValue: number): AtomMut<number>;
```

**Usage**:

```typescript
const countAtom = numberAtom(0);
countAtom(ctx, 10); // Direct assignment
countAtom(ctx, (prev) => prev + 1); // Functional update
```

#### `booleanAtom(initialValue)`

Creates boolean atom with boolean-specific methods.

```typescript
function booleanAtom(initialValue: boolean): AtomMut<boolean>;
```

**Usage**:

```typescript
const flagAtom = booleanAtom(false);
flagAtom(ctx, true); // Direct assignment
flagAtom(ctx, (prev) => !prev); // Functional update
```

#### `arrayAtom(initialValue)`

Creates array atom with array-specific methods.

```typescript
function arrayAtom<T>(initialValue: T[]): AtomMut<T[]>;
```

**Usage**:

```typescript
const listAtom = arrayAtom([]);
listAtom(ctx, [1, 2, 3]); // Direct assignment
listAtom(ctx, (prev) => [...prev, 4]); // Functional update
```

#### `objectAtom(initialValue)`

Creates object atom with object-specific methods.

```typescript
function objectAtom<T extends object>(initialValue: T): AtomMut<T>;
```

**Usage**:

```typescript
const configAtom = objectAtom({ theme: 'dark' });
configAtom(ctx, { theme: 'light' }); // Direct assignment
configAtom(ctx, (prev) => ({ ...prev, theme: 'light' })); // Functional update
```

### React API

#### `reatomComponent(component, name?)`

Creates React component with context access.

```typescript
function reatomComponent<P extends object>(
  component: (props: P & { ctx: Ctx }) => React.ReactElement,
  name?: string,
): React.ComponentType<P>;
```

**Component signature**: `(props: P & { ctx: Ctx }) => React.ReactElement`

- `props`: Component props + `ctx` for atom access

#### `useAtom(atom)`

Hook to access atom value and setter.

```typescript
function useAtom<T>(atom: AtomMut<T>): [T, (value: T | ((prev: T) => T)) => void];
```

**Returns**: `[value, setter]` tuple

- `value`: Current atom value
- `setter`: Function to update atom (accepts value or updater function)

#### `useAction(action)`

Hook to get action dispatcher.

```typescript
function useAction<Params extends any[]>(
  action: Action<Params, any>,
): [(...params: Params) => void];
```

**Returns**: `[dispatcher]`
