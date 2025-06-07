# ADR-003: MapPopover DRY Refactoring and SOLID Compliance

## Status

**Approved** - Architectural improvements to eliminate code duplication and improve SOLID compliance

## Executive Summary

This ADR addresses the architectural debt introduced in ADR-002 implementation, which created significant code duplication and SOLID principle violations. The solution introduces layered hook abstractions that maintain service benefits while eliminating ~100+ lines of duplicated code.

## Problem Analysis

### Code Duplication Issues Identified

**1. Position Tracking Logic Duplicated 3x:**

- `ConnectedMap.tsx` lines 64-130: Manual refs-based implementation (70 lines)
- `MapPopover.fixture.tsx` lines 129-207: Custom hook implementation (78 lines)
- `useMapPositionTracker.ts`: Original proper hook (114 lines) - **UNUSED**

**2. Service Integration Patterns Repeated:**

- Each component manually implements: click handling + service calls + position tracking
- Boilerplate pattern repeated across 7+ fixture demos
- Same error handling and cleanup logic duplicated

**3. Geographic-to-Screen Projection Logic Duplicated:**

```typescript
// This exact pattern appears 3 times:
const projected = map.project([lng, lat]);
const container = map.getContainer();
const rect = container.getBoundingClientRect();
const px = Math.min(Math.max(0, projected.x), rect.width);
const py = Math.min(Math.max(0, projected.y), rect.height);
const pageX = rect.left + px;
const pageY = rect.top + py;
```

### SOLID Principle Violations

**Single Responsibility Principle (SRP):**

- `ConnectedMap` handles: map management + position tracking + service integration + priority management
- Each fixture component handles: map setup + click handling + position tracking + service calls

**Open/Closed Principle (OCP):**

- Adding new popover behavior requires modifying existing components
- No extensible abstractions for common patterns

**Don't Repeat Yourself (DRY):**

- ~200 lines of duplicated position tracking and integration logic
- Same service call patterns across components

## Root Cause Analysis

The service-based approach from ADR-002 created a **low-level API** without corresponding **high-level abstractions**. Components went from using a simple `useMapPopoverInteraction` hook to manually implementing all integration logic.

**Before ADR-002 (Good):**

```typescript
// Single line of integration
useMapPopoverInteraction({ map, popoverService, renderContent });
```

**After ADR-002 (Bad):**

```typescript
// 40+ lines of manual integration per component
const currentLngLatRef = useRef<[number, number] | null>(null);
const isTrackingRef = useRef<boolean>(false);
// ... 40+ lines of position tracking logic
// ... manual click handling
// ... manual service calls
```

## Architectural Solution: Layered Hook Architecture

### Layer 1: Core Service (Existing)

- `MapPopoverService` - Low-level service API
- `useMapPositionTracker` - Reusable position tracking hook

### Layer 2: Integration Abstractions (New)

- `useMapPopoverIntegration` - High-level integration for simple maps
- `useMapPopoverPriorityIntegration` - Specialized integration for priority systems

### Layer 3: Application Components (Simplified)

- `ConnectedMap` - Uses priority integration hook
- Fixture components - Use simple integration hook

## Implementation

### 1. High-Level Integration Hook

```typescript
// src/core/map/hooks/useMapPopoverIntegration.ts
export function useMapPopoverIntegration(options: UseMapPopoverIntegrationOptions) {
  const { map, popoverService, renderContent, registry, enabled = true } = options;

  // Reuse existing position tracker hook
  const positionTracker = useMapPositionTracker(map, {
    onPositionChange: (point) => {
      // Handle position updates with placement calculation
      const container = map.getContainer();
      const rect = container.getBoundingClientRect();
      const { placement } = positionCalculator.calculate(
        rect,
        point.x - rect.left,
        point.y - rect.top,
      );
      popoverService.updatePosition(point, placement);
    },
  });

  // Click handling with service integration
  const handleMapClick = useCallback((event: MapMouseEvent) => {
    // Close existing + try registry + fallback to renderContent + start tracking
    // All boilerplate handled internally
  }, []);

  // Direct click event binding for simple maps
  useEffect(() => {
    if (!map || !enabled) return;
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
      positionTracker.stopTracking();
    };
  }, [map, enabled, handleMapClick, positionTracker]);

  return {
    close: () => {
      /* ... */
    },
    handleMapClick,
  };
}
```

### 2. Priority System Integration Hook

```typescript
// src/core/map/hooks/useMapPopoverPriorityIntegration.ts
export function useMapPopoverPriorityIntegration(
  options: UseMapPopoverPriorityIntegrationOptions,
) {
  const { priority = 55, enabled = true, ...integrationOptions } = options;

  // Reuse the main integration hook
  const { handleMapClick, close } = useMapPopoverIntegration({
    ...integrationOptions,
    enabled: false, // Disable direct binding, use priority system instead
  });

  // Register with priority system
  useEffect(() => {
    if (!options.map || !enabled) return;
    const unregister = registerMapListener('click', handleMapClick, priority);
    return () => {
      unregister();
      close();
    };
  }, [options.map, enabled, priority, handleMapClick, close]);

  return { close };
}
```

### 3. Simplified ConnectedMap

```typescript
// Before: 70+ lines of manual position tracking
function ConnectedMapWithPopover({ className }: { className?: string }) {
  const mapRef = useRef<ApplicationMap>();
  const popoverService = useMapPopoverService();
  // ... 70+ lines of manual position tracking and click handling

  // After: 5 lines
  useMapPopoverPriorityIntegration({
    map: mapRef.current || null,
    popoverService,
    registry: mapPopoverRegistry,
    priority: 55,
  });
```

### 4. Simplified Fixture Components

```typescript
// Before: 40+ lines per component
function DefaultDemo() {
  const map = useMapInstance(mapRef);
  const popoverService = useMapPopoverService();
  // ... 40+ lines of manual integration

  // After: 4 lines
  const { close } = useMapPopoverIntegration({
    map, popoverService, renderContent: defaultRenderContent,
  });
```

## Benefits Analysis

### Code Reduction

- **ConnectedMap**: 70+ lines → 5 lines (93% reduction)
- **Each fixture demo**: 40+ lines → 4 lines (90% reduction)
- **Total elimination**: ~200+ lines of duplicate code

### SOLID Compliance Improvements

**Single Responsibility Principle:**

- ✅ Components focus on their domain logic
- ✅ Position tracking isolated in reusable hook
- ✅ Service integration abstracted away

**Open/Closed Principle:**

- ✅ New popover behaviors extend hooks without modifying components
- ✅ Integration options configurable via hook parameters

**Don't Repeat Yourself:**

- ✅ Position tracking logic centralized in one hook
- ✅ Service integration patterns reusable across components
- ✅ Common boilerplate eliminated

### Architectural Quality

**Layered Abstractions:**

- Service layer unchanged (maintains ADR-002 benefits)
- Integration layer handles all boilerplate
- Component layer simplified and focused

**Reusability:**

- `useMapPopoverIntegration` works for simple maps
- `useMapPopoverPriorityIntegration` works for priority systems
- Both reuse existing `useMapPositionTracker` hook

**Maintainability:**

- Single source of truth for integration logic
- Clear separation of concerns
- Easy to test and debug

## Migration Strategy

### Phase 1: Infrastructure (Completed)

- ✅ Create `useMapPopoverIntegration` hook
- ✅ Create `useMapPopoverPriorityIntegration` hook
- ✅ Update exports

### Phase 2: ConnectedMap Refactoring

```typescript
// Replace manual implementation with:
useMapPopoverPriorityIntegration({
  map: mapRef.current || null,
  popoverService,
  registry: mapPopoverRegistry,
  priority: 55,
});
```

### Phase 3: Fixture Components Refactoring

```typescript
// Replace each demo's manual implementation with:
const { close } = useMapPopoverIntegration({
  map,
  popoverService,
  renderContent: demoRenderContent,
});
```

### Phase 4: Cleanup

- Remove deprecated custom position tracking implementations
- Update documentation and examples
- Remove unused imports

## Backwards Compatibility

- ✅ All existing service APIs unchanged
- ✅ Component behavior identical
- ✅ Performance characteristics maintained
- ✅ Can migrate incrementally

## Performance Impact

**Improved Performance:**

- Eliminated duplicate position tracking instances
- Reduced component complexity and re-renders
- Better hook dependency optimization

**Memory Usage:**

- Reduced ref objects and event listeners
- Single position calculator instance per map
- Cleaner cleanup and memory management

## Long-term Benefits

**Developer Experience:**

- Simple one-line integration for new components
- Clear patterns for common use cases
- Reduced cognitive load when implementing popovers

**Code Quality:**

- DRY compliance maintained
- SOLID principles followed
- Clear architectural boundaries

**Extensibility:**

- Easy to add new integration patterns
- Hook options allow customization
- Service layer remains flexible

## Future Considerations

### Potential Enhancements

1. **Lazy Loading**: Load position tracking only when needed
2. **Multi-Popover Support**: Extend hooks for multiple simultaneous popovers
3. **Animation Support**: Add transition configurations to hooks
4. **Performance Monitoring**: Add metrics for tracking usage patterns

### Migration from useMapPopoverInteraction

The deprecated `useMapPopoverInteraction` hook can be gradually replaced:

```typescript
// Old
useMapPopoverInteraction({ map, popoverService, renderContent });

// New
useMapPopoverIntegration({ map, popoverService, renderContent });
```

## Conclusion

This refactoring transforms the MapPopover system from a low-level service API with duplicated integration code into a well-architected system with proper abstraction layers. The solution:

- ✅ Eliminates 200+ lines of duplicate code
- ✅ Improves SOLID principle compliance
- ✅ Maintains all ADR-002 benefits
- ✅ Provides better developer experience
- ✅ Enables easier maintenance and extensibility

The layered hook architecture provides the right level of abstraction for each use case while maintaining the flexibility and service-based benefits from ADR-002.
