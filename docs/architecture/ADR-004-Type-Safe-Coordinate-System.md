# ADR-004: Type-Safe Coordinate System Architecture

## Status

**Approved** - Critical type safety improvement

## Context

The current map interaction system suffers from a **critical type safety flaw** where the same `ScreenPoint` type is used for fundamentally different coordinate systems, leading to runtime positioning bugs and developer confusion.

### Problem Statement

**Issue Identified:** [Architectural Debt Analysis](../investigations/architectural-debt-analysis.md) - Section 1

```typescript
// ❌ CURRENT: Same type for different coordinate systems
interface ScreenPoint {
  x: number;
  y: number;
}

// Incorrectly used for BOTH:
mapEvent.point; // Map container-relative coordinates (0 to mapWidth)
virtualReference; // Page-absolute coordinates (0 to pageWidth)
```

### Evidence of Runtime Impact

**Bug Location:** `src/core/map/popover/MapPopoverProvider.tsx:81`

```typescript
// ❌ RUNTIME BUG: Wrong coordinate system assignment
setGlobalPopover({
  screenPoint: mapEvent.point, // Map-relative passed as page-absolute!
});
```

**User Impact:** Popovers appear shifted from actual click locations, creating confusing UX.

## Decision

Implement **branded coordinate types** to enforce compile-time separation of coordinate systems and provide runtime conversion utilities.

### Core Type System

```typescript
// Branded types for compile-time safety
interface MapRelativePoint {
  x: number;
  y: number;
  readonly _coordinateSystem: 'map-relative';
}

interface PageAbsolutePoint {
  x: number;
  y: number;
  readonly _coordinateSystem: 'page-absolute';
}

interface GeographicPoint {
  lng: number;
  lat: number;
  readonly _coordinateSystem: 'geographic';
}
```

### Conversion Utilities

```typescript
// Type-safe coordinate conversion
class CoordinateConverter {
  static mapToPage(
    mapPoint: MapRelativePoint,
    containerElement: HTMLElement,
  ): PageAbsolutePoint {
    const rect = containerElement.getBoundingClientRect();
    return {
      x: rect.left + mapPoint.x,
      y: rect.top + mapPoint.y,
      _coordinateSystem: 'page-absolute',
    };
  }

  static pageToMap(
    pagePoint: PageAbsolutePoint,
    containerElement: HTMLElement,
  ): MapRelativePoint {
    const rect = containerElement.getBoundingClientRect();
    return {
      x: pagePoint.x - rect.left,
      y: pagePoint.y - rect.top,
      _coordinateSystem: 'map-relative',
    };
  }

  static geographicToMap(geoPoint: GeographicPoint, map: Map): MapRelativePoint {
    const projected = map.project([geoPoint.lng, geoPoint.lat]);
    return {
      x: projected.x,
      y: projected.y,
      _coordinateSystem: 'map-relative',
    };
  }
}
```

### Updated Service Interfaces

```typescript
interface MapPopoverService {
  // Now enforces page coordinates
  showWithContent(
    point: PageAbsolutePoint,
    content: React.ReactNode,
    options?: MapPopoverOptions,
  ): void;

  // Internal: handles coordinate conversion
  showWithEvent(mapEvent: MapMouseEvent, options?: MapPopoverOptions): boolean;

  // Position updates use page coordinates
  updatePosition(point: PageAbsolutePoint, placement?: Placement): void;
}
```

## Implementation Strategy

### Phase 1: Type Definitions

1. **Add branded coordinate types** to `src/core/map/types.ts`
2. **Create conversion utilities** in `src/core/map/utils/CoordinateConverter.ts`
3. **Deprecate generic `ScreenPoint`** with clear migration path

### Phase 2: Service Layer Updates

1. **Update MapPopoverService interface** to use `PageAbsolutePoint`
2. **Fix coordinate conversion in MapPopoverProvider.showWithEvent()**
3. **Update position tracker to use proper types**

### Phase 3: Consumer Updates

1. **Update all showWithContent() callers** to convert coordinates
2. **Update fixture files** with proper coordinate conversion
3. **Update documentation and examples**

### Phase 4: Validation

1. **Runtime validation** in development mode

## Technical Implementation

### Immediate Bug Fix

```typescript
// src/core/map/popover/MapPopoverProvider.tsx
const showWithEvent = useCallback(
  (mapEvent: MapMouseEvent, options?: MapPopoverOptions): boolean => {
    if (!registry) return false;

    const result = registry.renderContent(mapEvent);
    if (result) {
      // ✅ FIX: Convert map-relative to page-absolute coordinates
      const container = mapEvent.target.getContainer();
      const rect = container.getBoundingClientRect();
      const pagePoint: PageAbsolutePoint = {
        x: rect.left + mapEvent.point.x,
        y: rect.top + mapEvent.point.y,
        _coordinateSystem: 'page-absolute',
      };

      setGlobalPopover({
        id: 'global',
        isOpen: true,
        content: result.content,
        placement: mergedOptions.placement ?? 'top',
        screenPoint: pagePoint,
      });
      return true;
    }
    return false;
  },
  [registry],
);
```

## Migration Strategy

### Backward Compatibility

```typescript
// Temporary compatibility layer during migration
namespace LegacyCoordinates {
  export function fromScreenPoint(point: ScreenPoint): PageAbsolutePoint {
    console.warn('ScreenPoint deprecated - use PageAbsolutePoint');
    return {
      x: point.x,
      y: point.y,
      _coordinateSystem: 'page-absolute',
    };
  }
}
```

### Migration Checklist

- [ ] ✅ Type definitions added
- [ ] ✅ Conversion utilities implemented
- [ ] ✅ MapPopoverProvider coordinate bug fixed
- [ ] ✅ Service interfaces updated
- [ ] ⏳ Consumer code updated (in progress)

- [ ] ❌ Legacy ScreenPoint removed (future)

## Consequences

### Positive Consequences

**Compile-Time Safety:**

- ✅ TypeScript prevents coordinate system confusion
- ✅ Conversion functions enforce proper coordinate handling
- ✅ Runtime bugs eliminated at compile time

**Developer Experience:**

- ✅ Clear API contracts - no ambiguity about coordinate systems
- ✅ IDE autocompletion guides proper usage
- ✅ Self-documenting code through type system

**Code Quality:**

- ✅ Eliminates entire class of positioning bugs
- ✅ Forces explicit coordinate conversion decisions
- ✅ Improves maintainability through type clarity

### Temporary Challenges

**Migration Effort:**

- ⚠️ All coordinate-handling code requires updates
- ⚠️ Temporary type annotation verbosity
- ⚠️ Learning curve for branded types concept

**Bundle Size:**

- ✅ Zero runtime overhead - types erased during compilation
- ✅ Branded types use same memory layout as original types

## Monitoring and Validation

### Success Criteria

**Immediate (1 week):**

- Zero coordinate-related positioning bugs in test scenarios
- All service layer methods use proper coordinate types
- Fixture demos work correctly with coordinate conversion

**Short-term (1 month):**

- Zero production reports of shifted popover positioning
- Developer onboarding includes coordinate system understanding
- Integration tests validate coordinate conversion accuracy

### Failure Detection

**Type System Violations:**

```typescript
// Development-mode coordinate validation
if (process.env.NODE_ENV === 'development') {
  function validatePageCoordinate(point: PageAbsolutePoint) {
    if (!point._coordinateSystem || point._coordinateSystem !== 'page-absolute') {
      console.error('Invalid coordinate system - expected page-absolute');
    }
  }
}
```

**Runtime Monitoring:**

```typescript
// Track coordinate conversion calls
const coordinateMetrics = {
  conversions: 0,
  validationErrors: 0,
  performanceImpact: 0,
};
```

## Related Documentation

**Root Cause Analysis:** [Architectural Debt Analysis](../investigations/architectural-debt-analysis.md) - Section 1
**Migration Context:** [ADR-002: MapPopover Event System Integration](./ADR-002-MapPopover-Event-System-Integration.md)
**Implementation Patterns:** [ADR-003: MapPopover DRY Refactoring](./ADR-003-MapPopover-DRY-Refactoring.md)

**Future ADRs:**

- [ADR-005: Map Interaction System Consolidation](./ADR-005-Map-Interaction-System-Consolidation.md) - Will use these coordinate types
- [ADR-002 Amendment: Service Pattern Enforcement](./ADR-002-Amendment-Service-Pattern-Enforcement.md) - Coordinate-aware service consolidation

---

**Implementation Status:** IN PROGRESS - Coordinate conversion bug fix applied, type system implementation in development.
