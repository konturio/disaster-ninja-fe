# Technical Documentation Guide

## Table of Contents

- [Overview](#overview)
- [Document Structure](#document-structure)
- [API Documentation](#api-documentation)
- [Content Strategy](#content-strategy)
- [Writing Style](#writing-style)
- [Common Patterns](#common-patterns)
- [Pitfalls to Avoid](#pitfalls-to-avoid)

## Overview

Effective technical documentation balances **discoverability** with **completeness**. It should help developers understand both the API and how to use it effectively.

## Document Structure

### 1. Logical Organization

```
1. Overview/Introduction
2. Core Concepts
3. API Reference
4. Usage Patterns
5. Common Examples
6. Advanced Topics
```

### 2. Navigation

- **Table of Contents** with internal links
- **Clear section hierarchy** (H1 → H2 → H3)
- **Consistent naming** for related sections

### 3. Progressive Disclosure

- Start with **core concepts**
- Build complexity gradually
- Show **complete examples** before fragments

## API Documentation

### Function Signatures

#### ✅ Good: Expanded Inline Options

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

#### ❌ Bad: Interface References

```typescript
function withCache(options?: CacheOptions): ...
// Forces developers to hunt for interface definition
```

### Parameter Documentation

#### ✅ Good: Complete Context

```typescript
function atom<T>(
  initialState: T,
  reducer: (ctx: Ctx, state: T) => T
): AtomMut<T>

**Reducer signature**: `(ctx: Ctx, state: T) => T`
- `ctx`: Context for accessing other atoms
- `state`: Current atom state
- **Returns**: New state value

**Note**: Reducer is called on every atom access, not just updates.
```

#### ❌ Bad: Minimal Information

```typescript
function atom<T>(initialState: T, reducer): AtomMut<T>;
// No explanation of what reducer does or when it's called
```

### Return Type Documentation

#### ✅ Good: Practical Context

```typescript
**Returns**: `AsyncAction` with additional properties:
- `pendingAtom`: Atom<number> - tracks pending requests count
- `onFulfill`: Action<[Response], Response>
- `onReject`: Action<[unknown], unknown>
- `onSettle`: Action<[], void>
```

#### ❌ Bad: Just Type Names

```typescript
**Returns**: AsyncAction<Params, Response>
// No explanation of what this provides
```

## Content Strategy

### 1. Built-in vs Optional Features

#### ✅ Good: Clear Scope

```markdown
#### Built-in Features (without operators)

1. **Reactive Dependency Tracking**
2. **Promise Management**
3. **Automatic Abort Control**

#### What's NOT Included (Requires Operators)

1. **Data State Management** - Requires `withDataAtom`
2. **Error State Management** - Requires `withErrorAtom`
3. **Caching** - Requires `withCache`
```

#### ❌ Bad: Unclear Scope

```markdown
#### Features

- Data management
- Error handling
- Caching
  // Doesn't explain what's built-in vs optional
```

### 2. Complete Setup Examples

#### ✅ Good: Full Context

```typescript
const userResource = reatomResource(async (ctx) => {
  const id = ctx.spy(userIdAtom);
  return await ctx.schedule(() => fetch(`/api/users/${id}`).then((r) => r.json()));
}).pipe(
  // Add data state management
  withDataAtom(null),

  // Add error handling
  withErrorAtom((ctx, error) => {
    if (error instanceof Response) return error.status;
    return error instanceof Error ? error : new Error(String(error));
  }),

  // Add caching
  withCache({
    staleTime: 5000,
    cacheTime: 30000,
  }),
);

// Available features after setup:
// - userResource.dataAtom
// - userResource.errorAtom
// - userResource.cacheAtom.invalidate(ctx)
```

#### ❌ Bad: Fragment Examples

```typescript
const resource = userResource.pipe(withDataAtom(null));
// No context of what this provides or how to use it
```

### 3. Practical Patterns

#### ✅ Good: Real-World Usage

```typescript
// Manual refresh button
const refreshUser = action((ctx) => {
  userResource.cacheAtom.invalidate(ctx);
}, 'refreshUser');

// Auto retry on error
onConnect(userResource.errorAtom, (ctx) => {
  if (ctx.get(userResource.errorAtom)) {
    userResource.retry(ctx);
  }
});
```

#### ❌ Bad: Theoretical Examples

```typescript
// Example usage
resource.invalidate();
// No context of when/why to use this
```

## Writing Style

### 1. Technical Focus

- **Avoid marketing language** and business terminology
- **Focus on implementation details** over conceptual overviews
- **Use precise technical terms** consistently

### 2. Conciseness

- **Remove unnecessary explanations** and verbose introductions
- **Prioritize practical information** over theoretical concepts
- **Use clear, direct language**

### 3. Consistency

- **Consistent formatting** for similar content types
- **Uniform terminology** throughout the document
- **Standardized code examples** with consistent patterns

## Common Patterns

### 1. API Reference Structure

````markdown
#### `functionName(params)`

Brief description of what the function does.

```typescript
function functionName<T>(
  param1: Type1, // Description of param1
  param2?: {
    // OptionalType
    option1?: Type2; // Description of option1
    option2?: Type3; // Description of option2
  },
): ReturnType;
```
````

**Parameter details**: Explanation of each parameter
**Returns**: What the function returns and how to use it
**Note**: Important behavioral details or gotchas

````

### 2. Usage Pattern Structure
```markdown
### Pattern Name
Description of when to use this pattern.

```typescript
// Complete working example
const example = createExample({
  option1: 'value1',
  option2: 'value2'
})

// Usage
example.doSomething()
````

**Key points**: Important considerations
**Alternatives**: When to use different approaches

````

### 3. Complete Setup Structure
```markdown
### Complete Setup
Shows how all features work together.

```typescript
const resource = createResource().pipe(
  withFeature1(),
  withFeature2({ option: 'value' }),
  withFeature3()
)

// Available after setup:
// - resource.feature1Atom
// - resource.feature2()
// - resource.feature3.reset()
````

````

## Pitfalls to Avoid

### 1. Interface References
- **Don't reference interfaces** without showing their definition
- **Expand options inline** for immediate discovery
- **Use interface comments** only for type reference: `options?: {  // InterfaceName`

### 2. Incomplete Examples
- **Don't show fragments** without full context
- **Always show complete setup** when introducing new concepts
- **Include usage examples** with the API definitions

### 3. Missing Behavioral Notes
- **Don't omit important details** about when functions are called
- **Explain subscription behavior** (ctx.get vs ctx.spy)
- **Document side effects** and their timing

### 4. Theoretical-Only Content
- **Don't focus only on API signatures** without practical context
- **Include real-world usage patterns**
- **Show complete working examples**

### 5. Unclear Scope
- **Don't mix built-in and optional features** without distinction
- **Clearly explain what's included** vs what requires additional setup
- **Show progression** from basic to advanced usage

## Best Practices Summary

1. **Start with core concepts** before diving into API details
2. **Expand options inline** for immediate discovery
3. **Show complete setup examples** demonstrating feature combinations
4. **Explain built-in vs optional features** clearly
5. **Include practical patterns** for real-world usage
6. **Document behavioral nuances** and important gotchas
7. **Use consistent formatting** and terminology
8. **Focus on discoverability** and practical application
9. **Provide progressive complexity** from basic to advanced
10. **Include type references** in comments for reuse

## Template for New Documentation

```markdown
# Library Name Documentation

## Table of Contents
- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Usage Patterns](#usage-patterns)
- [Common Examples](#common-examples)

## Overview
Brief description of what the library does and its core principles.

## Core Concepts
Explain the fundamental building blocks and how they work together.

## API Reference
Complete function signatures with expanded options and behavioral notes.

## Usage Patterns
Real-world examples showing how to combine features effectively.

## Common Examples
Complete setup examples demonstrating typical use cases.
````
