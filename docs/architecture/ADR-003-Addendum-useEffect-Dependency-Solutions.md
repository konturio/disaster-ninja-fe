# ADR-003 Addendum: useEffect Dependency Hell Solutions

## Status

**Approved** - Critical architectural lesson learned and applied

## Problem: useEffect Dependency Hell

During implementation of the layered hook architecture from ADR-003, we encountered the classic React useEffect dependency hell:

### **Root Cause Analysis**

**C.1> Function Recreation on Every Render:**

```typescript
// ❌ PROBLEMATIC: Functions recreated every render
const handleMapClick = useCallback(
  (event) => {
    // ... logic uses map, popoverService, registry, renderContent, onError
  },
  [map, popoverService, registry, renderContent, onError],
); // Too many dependencies!

const handlePositionChange = useCallback(
  (point) => {
    // ... logic uses map, popoverService, positionCalculator
  },
  [map, popoverService, positionCalculator],
); // Dependencies change constantly!

useEffect(() => {
  map.on('click', handleMapClick); // Re-runs when handleMapClick changes
  return () => map.off('click', handleMapClick);
}, [map, handleMapClick]); // handleMapClick changes every render!
```

**C.2> Infinite Re-render Loop:**

1. Component renders with new props
2. useCallback recreates functions due to dependency changes
3. useEffect sees new function reference, re-runs
4. Event listeners removed/re-added unnecessarily
5. Side effects trigger more renders
6. **INFINITE LOOP**

**C.3> Why useCallback Didn't Help:**

- Dependencies like `popoverService`, `registry`, `renderContent` change frequently
- Even stable-looking objects get new references on re-renders
- useCallback becomes useless when dependencies are unstable

## Solution: Manual Ref-Based State Management

### **Pattern: Store Current Values in Refs**

```typescript
// ✅ SOLUTION: Manual ref-based approach
export function useMapPopoverMaplibreIntegration(
  options: UseMapPopoverMaplibreIntegrationOptions,
) {
  // Store ALL reactive values in refs
  const mapRef = useRef(map);
  const popoverServiceRef = useRef(popoverService);
  const registryRef = useRef(registry);
  const renderContentRef = useRef(renderContent);
  const onErrorRef = useRef(onError);
  const enabledRef = useRef(enabled);

  // Update refs when values change (no useEffect needed!)
  mapRef.current = map;
  popoverServiceRef.current = popoverService;
  registryRef.current = registry;
  renderContentRef.current = renderContent;
  onErrorRef.current = onError;
  enabledRef.current = enabled;

  // Functions use refs - no dependencies needed!
  const handleMapClickRef = useRef<(event: MapMouseEvent) => void>();
  handleMapClickRef.current = (event: MapMouseEvent) => {
    const currentMap = mapRef.current;
    const currentService = popoverServiceRef.current;
    const currentRegistry = registryRef.current;
    // ... use current values from refs
  };

  // Stable useEffect with minimal dependencies
  useEffect(() => {
    if (!map || !enabled) return;

    const clickHandler = (event: MapMouseEvent) => {
      handleMapClickRef.current?.(event); // Always uses latest function
    };

    map.on('click', clickHandler);
    return () => map.off('click', clickHandler);
  }, [map, enabled]); // Only depend on truly stable values!
}
```

### **Key Benefits of Ref-Based Approach:**

**C.4> Eliminates Function Recreation:**

- Functions stored in refs are never recreated
- useEffect dependencies become minimal and stable
- No more infinite re-render loops

**C.5> Always Uses Latest Values:**

- Refs automatically provide latest values
- No stale closure problems
- No need to manage complex dependency arrays

**C.6> Predictable Behavior:**

- useEffect only runs when map instance or enabled flag changes
- Event listeners aren't constantly removed/re-added
- Performance is much better

## Comparison: Before vs After

### Before (Dependency Hell)

```typescript
// ❌ Problems:
// - handleMapClick recreated every render
// - useEffect runs constantly
// - Event listeners churned
// - Infinite loops possible

const handleMapClick = useCallback(
  (event) => {
    // Logic using many dependencies
  },
  [map, popoverService, registry, renderContent, onError],
); // UNSTABLE!

useEffect(() => {
  map.on('click', handleMapClick); // Re-runs constantly
  return () => map.off('click', handleMapClick);
}, [map, handleMapClick]); // handleMapClick always changing
```

### After (Ref-Based Solution)

```typescript
// ✅ Solutions:
// - Functions stored in refs, never recreated
// - useEffect runs only when needed
// - Event listeners stable
// - No infinite loops

const handleMapClickRef = useRef<(event: MapMouseEvent) => void>();
handleMapClickRef.current = (event) => {
  // Logic using ref.current values - always latest!
};

useEffect(() => {
  const clickHandler = (event) => handleMapClickRef.current?.(event);
  map.on('click', clickHandler); // Only runs when map/enabled changes
  return () => map.off('click', clickHandler);
}, [map, enabled]); // STABLE dependencies!
```

## Implementation Pattern

### **Step 1: Identify Reactive Values**

All values that come from props, state, or context that might change:

- `map`, `popoverService`, `registry`, `renderContent`, `onError`, `enabled`

### **Step 2: Create Refs for Each Value**

```typescript
const mapRef = useRef(map);
const popoverServiceRef = useRef(popoverService);
// ... etc for each reactive value
```

### **Step 3: Update Refs on Every Render**

```typescript
// This is cheap and safe - no useEffect needed
mapRef.current = map;
popoverServiceRef.current = popoverService;
// ... etc
```

### **Step 4: Store Functions in Refs**

```typescript
const handleMapClickRef = useRef<(event: MapMouseEvent) => void>();
handleMapClickRef.current = (event) => {
  // Use currentRef.current for all reactive values
  const currentMap = mapRef.current;
  const currentService = popoverServiceRef.current;
  // ... implementation
};
```

### **Step 5: Stable useEffect**

```typescript
useEffect(() => {
  const clickHandler = (event) => handleMapClickRef.current?.(event);
  map.on('click', clickHandler);
  return () => map.off('click', clickHandler);
}, [map, enabled]); // Only truly stable values
```

## Critical Lessons Learned

### **C.7> When to Use Refs vs useCallback:**

**Use Refs When:**

- Functions have many dependencies that change frequently
- You're setting up event listeners in useEffect
- Performance is critical and you need stable references
- You're experiencing infinite re-render loops

**Use useCallback When:**

- Functions have 1-2 stable dependencies
- You're passing functions as props to child components
- Dependencies truly are stable (primitives, rarely-changing objects)

### **C.8> Manual vs Automatic Dependency Management:**

**Manual (Refs):**

- ✅ Predictable behavior
- ✅ No infinite loops
- ✅ Better performance
- ❌ More verbose
- ❌ Requires discipline

**Automatic (useCallback/useEffect):**

- ✅ More "React-like"
- ✅ Less code
- ❌ Dependency hell with complex objects
- ❌ Infinite loops possible
- ❌ Hard to debug

### **C.9> Performance Characteristics:**

**Ref-Based Approach:**

- Event listeners: Added once, stable for component lifetime
- Function creation: Zero after initial render
- Re-renders: Minimal, only when truly necessary

**useCallback Approach (with unstable dependencies):**

- Event listeners: Constantly removed/re-added
- Function creation: Every render
- Re-renders: Frequent due to changing dependencies

## Migration Strategy

### **Phase 1: Identify Problem Hooks**

Look for hooks with:

- Many useCallback dependencies
- useEffect that depends on functions
- Infinite re-render loops in development

### **Phase 2: Convert to Ref-Based**

```typescript
// Before
const handler = useCallback(() => {}, [dep1, dep2, dep3, dep4]);

// After
const dep1Ref = useRef(dep1);
const dep2Ref = useRef(dep2);
const dep3Ref = useRef(dep3);
const dep4Ref = useRef(dep4);

dep1Ref.current = dep1;
// ... etc

const handlerRef = useRef(() => {});
handlerRef.current = () => {
  // Use dep1Ref.current, etc.
};
```

### **Phase 3: Simplify useEffect Dependencies**

Only depend on truly stable values like map instances, enabled flags, etc.

## Conclusion

The ref-based approach is sometimes more predictable than React's automatic dependency tracking. When dealing with complex integration hooks that manage external resources (like map event listeners), manual state management with refs can prevent the useEffect dependency hell that leads to infinite loops and performance problems.

**Key Takeaway:** Not every React pattern needs to be "React-y". Sometimes, manual management with refs provides better predictability and performance than automatic dependency tracking.
