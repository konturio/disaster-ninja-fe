# MapPopover System Cleanup Plan

## Status: ADR-004 Dropped, Focus on Real Issues

**Decision:** Drop ADR-004 type-safe coordinate system - it adds complexity without benefit. The coordinate system already works correctly.

## Current State ✅ GOOD

**What's Working:**

- ✅ Service-based architecture (ADR-002) - working in production
- ✅ Integration hooks (ADR-003) - eliminate service integration boilerplate
- ✅ Coordinate conversion - no bugs, positioning works correctly
- ✅ Registry system - clean provider pattern for content

**Why ADR-004 Was Wrong:**

- Branded types are just type assertions: `return point as MapPagePoint`
- No runtime benefit, pure compile-time theater
- Coordinate handling already works correctly in `MapPopoverProvider.tsx`
- The "critical bug" described doesn't exist in actual code

## Remaining Work 🔧 TODO

### 1. Clean Up Type System (Quick Win)

**Problem:** ADR-004 left noise in the codebase

**Action:**

```typescript
// Remove branded types from types.ts:
- export type MapPagePoint = ScreenPoint & { __mapPagePoint: true };
- export type MapContainerPoint = ScreenPoint & { __mapContainerPoint: true };

// Keep simple types:
+ export interface ScreenPoint { x: number; y: number; }
+ export interface GeographicPoint { lng: number; lat: number; }
```

**Impact:** Cleaner, simpler code. Same runtime behavior.

### 2. Consolidate Position Tracking (Medium)

**Problem:** Position tracking logic duplicated in multiple places

**Current Duplication:**

- `useMapPositionTracker.ts` - ✅ Proper implementation (KEEP)
- `ConnectedMap.tsx` lines 64-130 - ❌ Manual implementation (REMOVE)
- Fixture demos - ⚠️ Mixed usage (STANDARDIZE)

**Action:**

```typescript
// ConnectedMap.tsx - Replace manual tracking with:
useMapPopoverPriorityIntegration({
  map: mapRef.current || null,
  popoverService,
  registry: mapPopoverRegistry,
  priority: 55,
});
```

### 3. Simplify Coordinate Converter (Small)

**Problem:** Coordinate conversion has no-op functions from ADR-004

**Current:**

```typescript
// ❌ No-op functions that just cast types
export function screenPointToMapPagePoint(point: ScreenPoint): MapPagePoint {
  return point as MapPagePoint;
}
```

**Action:** Keep only the useful function:

```typescript
// ✅ Keep this - actual coordinate conversion
export function mapContainerPointToPagePoint(
  mapContainerPoint: { x: number; y: number },
  mapEventTarget: MapMouseEvent['target'],
): { x: number; y: number } {
  const container = mapEventTarget.getContainer();
  const rect = container.getBoundingClientRect();
  return {
    x: rect.left + mapContainerPoint.x,
    y: rect.top + mapContainerPoint.y,
  };
}
```

## Implementation Priority

### Phase 1: Type System Cleanup ✅ COMPLETE

1. ✅ Removed branded types from `types.ts`
2. ✅ Removed no-op functions from `coordinateConverter.ts`
3. ✅ Updated all imports to use simple `ScreenPoint`

### Phase 2: Position Tracking Consolidation (2-3 hours)

1. Update ConnectedMap to use `useMapPopoverPriorityIntegration`
2. Remove manual position tracking implementation
3. Standardize fixture demos

### Phase 3: Documentation Update (30 minutes)

1. Update ADR-002 and ADR-003 with current status
2. Remove references to dropped ADR-004
3. Update MapPopover.md with simplified examples

## Success Criteria

**Code Quality:**

- ✅ Zero no-op functions in coordinate system
- ✅ Single position tracking implementation
- ✅ Simple, clear types

**Functionality:**

- ✅ Popover positioning works identically
- ✅ All integration patterns continue working
- ✅ No behavioral changes for users

**Maintainability:**

- ✅ Easier onboarding - simpler type system
- ✅ Less code duplication
- ✅ Clear architectural boundaries

## Risk Assessment: LOW

**Why This Is Safe:**

- No functional changes - only code cleanup
- Coordinate system already works correctly
- Integration hooks already eliminate the real duplication
- Can be done incrementally without breaking changes

**The Real Win:** Focus development effort on actual features instead of over-engineered type systems.
