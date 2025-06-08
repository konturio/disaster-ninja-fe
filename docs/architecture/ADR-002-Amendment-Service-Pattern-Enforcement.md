# ADR-002 Amendment: Service Pattern Enforcement

## Status

**Approved** - Architectural consolidation amendment to [ADR-002](./ADR-002-MapPopover-Event-System-Integration.md)

## Context

[ADR-002](./ADR-002-MapPopover-Event-System-Integration.md) successfully established the **service-based delegation architecture** for MapPopover, but the implementation inadvertently created **competing architectural patterns** rather than consolidating them.

### Problem Analysis

**Issue Identified:** [Architectural Debt Analysis](../investigations/architectural-debt-analysis.md) - Section 2

The codebase currently maintains **three overlapping patterns** for identical functionality:

```typescript
// Pattern 1: Service-based (ADR-002 recommendation) ✅
interface MapPopoverService {
  showWithContent(point: ScreenPoint, content: React.ReactNode): void;
  showWithEvent(mapEvent: MapMouseEvent): boolean;
  updatePosition(point: ScreenPoint): void;
}

// Pattern 2: Controller-based (legacy) ❌
class MapPopoverController {
  handleClick(event: MapClickEvent): void;
  close(): void;
  destroy(): void;
}

// Pattern 3: Hook-based wrapper (confusion layer) ❌
function useMapPopoverMaplibreIntegration(options) {
  // Adds useEffect/useCallback complexity over service calls
}
```

### Developer Confusion Evidence

**Current Usage Patterns:**

- **Service pattern:** Used in `MapPopoverProvider`, fixture demos
- **Controller pattern:** Used in legacy examples, some renderer integrations
- **Hook pattern:** Used in `ConnectedMap`, advanced scenarios

**Problems Created:**

1. **No clear architectural guidance** - developers choose arbitrarily
2. **Inconsistent error handling** - each pattern handles failures differently
3. **Code duplication** - similar logic repeated across all three patterns
4. **Testing complexity** - must test multiple paths for same functionality

## Decision

**Enforce single service-based pattern** as specified in ADR-002, with systematic removal of competing implementations.

### Standardized Architecture

```typescript
// ✅ ONLY allowed pattern: Service-based delegation
interface StandardMapPopoverAPI {
  // Enhanced API from ADR-002
  showWithContent(
    point: PageAbsolutePoint,
    content: React.ReactNode,
    options?: MapPopoverOptions,
  ): void;
  showWithEvent(mapEvent: MapMouseEvent, options?: MapPopoverOptions): boolean;
  updatePosition(point: PageAbsolutePoint, placement?: Placement): void;

  // Control methods
  close(): void;
  isOpen(): boolean;
}
```

### Integration Patterns

```typescript
// ✅ ConnectedMap integration (priority system)
function ConnectedMapWithPopover() {
  const popoverService = useMapPopoverService();

  // Register with priority system - single integration point
  useEffect(() => {
    const unregister = registerMapListener(
      'click',
      (event) => {
        return popoverService.showWithEvent(event);
      },
      55,
    );

    return unregister;
  }, [popoverService]);
}

// ✅ Simple map integration (direct)
function SimpleMapWithPopover() {
  const popoverService = useMapPopoverService();

  useEffect(() => {
    if (!map) return;

    const handleClick = (event: MapMouseEvent) => {
      popoverService.showWithEvent(event);
    };

    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map, popoverService]);
}
```

## Implementation Plan

### Phase 1: Deprecate Controller Pattern

**Remove:** `src/core/map/popover/MapPopoverController.ts`

```typescript
// ❌ REMOVE: Controller-based pattern
class MapPopoverController {
  // ... entire class removed
}
```

**Rationale:**

- Controller adds unnecessary abstraction layer over service
- Duplicates error handling and lifecycle management
- No clear benefit over direct service usage

### Phase 2: Simplify Hook Pattern

**Current problematic hook:**

```typescript
// ❌ PROBLEMATIC: Adds useEffect complexity over simple service calls
function useMapPopoverMaplibreIntegration(
  options: UseMapPopoverMaplibreIntegrationOptions,
) {
  // 100+ lines of useEffect/useCallback/ref management
  // All to wrap simple service calls
}
```

**Simplified approach:**

```typescript
// ✅ SIMPLIFIED: Direct service usage with optional utility hooks
function useSimpleMapPopover(map: Map | null, renderContent: RenderPopoverContentFn) {
  const popoverService = useMapPopoverService();

  useEffect(() => {
    if (!map) return;

    const handleClick = (event: MapMouseEvent) => {
      const context = { map, lngLat: event.lngLat, point: event.point /* ... */ };
      const content = renderContent(context);
      if (content) {
        popoverService.showWithContent(
          CoordinateConverter.mapToPage(event.point, map.getContainer()),
          content,
        );
      }
    };

    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map, popoverService, renderContent]);
}
```

### Phase 3: Update All Consumers

**Migration Examples:**

```typescript
// Before: Controller usage
const controller = new MapPopoverController({
  map,
  popoverService,
  positionTracker,
  positionCalculator,
  renderContent,
});

// After: Direct service usage
useEffect(() => {
  const handleClick = (event) => {
    const content = renderContent(createContext(event));
    if (content) {
      popoverService.showWithContent(convertCoordinates(event.point), content);
    }
  };

  map.on('click', handleClick);
  return () => map.off('click', handleClick);
}, [map, popoverService, renderContent]);
```

```typescript
// Before: Complex hook usage
const { close } = useMapPopoverMaplibreIntegration({
  map,
  popoverService,
  renderContent,
  registry,
  positionCalculator,
  enabled,
  trackingDebounceMs,
  onError,
});

// After: Simple service usage
const popoverService = useMapPopoverService();
useSimpleMapPopover(map, renderContent);
```

## Service Interface Standardization

### Enhanced Service Contract

```typescript
interface MapPopoverService {
  // Content-based API - caller provides rendered content
  showWithContent(
    point: PageAbsolutePoint, // From ADR-004: Type-safe coordinates
    content: React.ReactNode,
    options?: MapPopoverOptions,
  ): void;

  // Registry-based API - service determines content from providers
  showWithEvent(mapEvent: MapMouseEvent, options?: MapPopoverOptions): boolean; // Returns true if content was shown

  // Position updates during map movement
  updatePosition(point: PageAbsolutePoint, placement?: Placement): void;

  // Control methods
  close(): void;
  isOpen(): boolean;
}
```

### Error Handling Standardization

```typescript
// Consistent error handling across all service methods
class MapPopoverServiceImpl implements MapPopoverService {
  showWithContent(
    point: PageAbsolutePoint,
    content: React.ReactNode,
    options?: MapPopoverOptions,
  ) {
    try {
      // Implementation with standardized error boundaries
    } catch (error) {
      console.error('MapPopover showWithContent failed:', error);
      this.reportError('showWithContent', error, { point, options });
    }
  }

  private reportError(method: string, error: Error, context: any) {
    // Centralized error reporting
    metrics.recordError('MapPopoverService', method, error);
  }
}
```

## Migration Strategy

### Backward Compatibility

```typescript
// Temporary compatibility layer for gradual migration
namespace LegacyMapPopover {
  /** @deprecated Use MapPopoverService directly */
  export function createController(config: any) {
    console.warn('MapPopoverController deprecated - use MapPopoverService');
    return {
      handleClick: (event: any) => {
        // Delegate to service
      },
    };
  }

  /** @deprecated Use useSimpleMapPopover or direct service calls */
  export function useMapPopoverMaplibreIntegration(options: any) {
    console.warn(
      'useMapPopoverMaplibreIntegration deprecated - use direct service calls',
    );
    // Simplified implementation
  }
}
```

### Migration Checklist

**Week 1:**

- [ ] ✅ Mark MapPopoverController as deprecated
- [ ] ✅ Create legacy compatibility warnings
- [ ] ✅ Update service interface documentation

**Week 2:**

- [ ] ⏳ Update ConnectedMap to use direct service calls
- [ ] ⏳ Update fixture files to use simplified patterns
- [ ] ⏳ Remove complex useMapPopoverMaplibreIntegration hook

**Week 3:**

- [ ] ❌ Remove MapPopoverController entirely
- [ ] ❌ Remove compatibility warnings
- [ ] ❌ Clean up unused imports and exports

## Consequences

### Positive Consequences

**Architectural Clarity:**

- ✅ Single service pattern - no decision fatigue for developers
- ✅ Consistent error handling and lifecycle management
- ✅ Clear API contracts through standardized service interface

**Code Quality:**

- ✅ Eliminates ~300 lines of duplicated integration logic
- ✅ Improves maintainability through simplified architecture

**Developer Experience:**

- ✅ Clear onboarding path - learn one pattern, apply everywhere
- ✅ Consistent debugging experience across all map interactions
- ✅ Reduced cognitive load - fewer architectural decisions to make

### Temporary Challenges

**Migration Effort:**

- ⚠️ All existing controller/hook usage requires updates
- ⚠️ Some complex integration scenarios need simplification

**Learning Curve:**

- ⚠️ Developers need to learn direct service usage patterns
- ⚠️ Position tracking integration becomes more manual
- ⚠️ Error handling patterns change slightly

## Success Metrics

### Code Quality Metrics

**Before Consolidation:**

- Multiple integration patterns: 3 different approaches
- Lines of duplicated logic: ~300 lines
- Testing complexity: 3 different mocking strategies

**After Consolidation (Target):**

- Integration patterns: 1 service-based approach
- Lines of duplicated logic: <20 lines
- Testing complexity: 1 unified mocking strategy

### Developer Experience Metrics

**Time to implement new map popover:**

- Before: 1-2 hours (confusion about which pattern to use)
- After: 15-30 minutes (clear service-based approach)

**Onboarding time for map features:**

- Before: 4-6 hours (learn multiple patterns)
- After: 1-2 hours (single pattern understanding)

## Related Documentation

**Root Analysis:** [Architectural Debt Analysis](../investigations/architectural-debt-analysis.md) - Section 2
**Original Decision:** [ADR-002: MapPopover Event System Integration](./ADR-002-MapPopover-Event-System-Integration.md)
**Type Safety:** [ADR-004: Type-Safe Coordinate System Architecture](./ADR-004-Type-Safe-Coordinate-System.md)

**Implementation Patterns:** [ADR-003: MapPopover DRY Refactoring](./ADR-003-MapPopover-DRY-Refactoring.md)
**Future Unification:** [ADR-005: Map Interaction System Consolidation](./ADR-005-Map-Interaction-System-Consolidation.md)

---

**Amendment Status:** APPROVED - Service pattern enforcement in progress, controller deprecation initiated.
