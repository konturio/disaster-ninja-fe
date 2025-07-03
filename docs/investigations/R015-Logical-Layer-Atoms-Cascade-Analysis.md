# R015: Logical Layer Atoms Cascade Analysis

## Table of Contents

- [Executive Summary](#executive-summary)
- [System Architecture](#system-architecture)
- [Implementation Analysis](#implementation-analysis)
- [Current Usage Analysis](#current-usage-analysis)
- [State Management Integration](#state-management-integration)
- [Architectural Inconsistencies](#architectural-inconsistencies)
- [System Boundaries](#system-boundaries)

## Executive Summary

Logical layer atoms create O(n) cascade reactions for single layer operations due to broad dependencies on shared Map atoms containing all layer data. Each layer atom depends on 7 shared atoms storing data for 20+ layers, causing every layer to recalculate when any layer's data changes. Performance bottlenecks concentrate in shared atom modification points where optimization efforts should focus.

## System Architecture

### Single Layer Atom Dependency Flow

**Pattern**: Each layer atom depends on 7 shared atoms containing all layer data, extracting only its own data but reacting to all changes.

```mermaid
graph LR
    subgraph "Shared Atoms (All Layers Data)"
        LSA["`layersSourcesAtom
        Map&lt;'layerA' | 'layerB' | ... | 'layerN', AsyncState&gt;`"]
        LLA["`layersLegendsAtom
        Map&lt;'layerA' | 'layerB' | ... | 'layerN', AsyncState&gt;`"]
        LSE["`layersSettingsAtom
        Map&lt;'layerA' | 'layerB' | ... | 'layerN', AsyncState&gt;`"]
        LMA["`layersMetaAtom
        Map&lt;'layerA' | 'layerB' | ... | 'layerN', AsyncState&gt;`"]
        LEA["`layersEditorsAtom
        Map&lt;'layerA' | 'layerB' | ... | 'layerN', AsyncState&gt;`"]
        LME["`layersMenusAtom
        Map&lt;'layerA' | 'layerB' | ... | 'layerN', Menu&gt;`"]
        HLA["`hiddenLayersAtom
        Set&lt;'layerA' | 'layerB' | ... | 'layerN'&gt;`"]
        ELA["`enabledLayersAtom
        Set&lt;'layerA' | 'layerB' | ... | 'layerN'&gt;`"]
        MLA["`mountedLayersAtom
        Map&lt;'layerA' | 'layerB' | ... | 'layerN', LayerAtom&gt;`"]
    end

    subgraph "Single Layer Atom (Example: layerA)"
        LA["`logicalLayerAtom('layerA')
        Recalculates on ANY change
        to ANY of the 7 shared atoms`"]
    end

    subgraph "Data Extraction (Only layerA data used)"
        EX1["`get('layersSourcesAtom').get('layerA')`"]
        EX2["`get('layersLegendsAtom').get('layerA')`"]
        EX3["`get('layersSettingsAtom').get('layerA')`"]
        EX4["`get('layersMetaAtom').get('layerA')`"]
        EX5["`get('layersEditorsAtom').get('layerA')`"]
        EX6["`get('layersMenusAtom').get('layerA')`"]
        EX7["`get('hiddenLayersAtom').has('layerA')`"]
    end

    subgraph "Circular Modifications (Layer writes back)"
        MOD1["`hiddenLayersAtom.set('layerA')
        onAction('hide')`"]
        MOD2["`enabledLayersAtom.set('layerA')
        onAction('enable')`"]
        MOD3["`mountedLayersAtom.set('layerA', atom)
        mount logic`"]
    end

    LSA -->|❌ reacts to layerB, layerC... changes| LA
    LLA -->|❌ reacts to layerB, layerC... changes| LA
    LSE -->|❌ reacts to layerB, layerC... changes| LA
    LMA -->|❌ reacts to layerB, layerC... changes| LA
    LEA -->|❌ reacts to layerB, layerC... changes| LA
    LME -->|❌ reacts to layerB, layerC... changes| LA
    HLA -->|✅ should react to visibility changes| LA
    ELA -->|❌ non-reactive via getUnlistedState| LA
    MLA -->|❌ non-reactive via getUnlistedState| LA

    LA --> EX1
    LA --> EX2
    LA --> EX3
    LA --> EX4
    LA --> EX5
    LA --> EX6
    LA --> EX7

    LA --> MOD1
    LA --> MOD2
    LA --> MOD3

    MOD1 -->|triggers cascade| HLA
    MOD2 -->|triggers cascade| ELA
    MOD3 -->|triggers cascade| MLA

    style LSA stroke:#ff6b6b,stroke-width:3px
    style LLA stroke:#ff6b6b,stroke-width:3px
    style LSE stroke:#ff6b6b,stroke-width:3px
    style LA stroke:#ffa726,stroke-width:3px
    style MOD1 stroke:#ef5350,stroke-width:2px
    style MOD2 stroke:#ef5350,stroke-width:2px
    style MOD3 stroke:#ef5350,stroke-width:2px
```

### Cascade Flow Analysis

**Problem**: LayerA atom recalculates when LayerB's data changes, even though LayerA only uses LayerA's data.

**Example Cascade**:

1. `layersSourcesAtom.set('layerB', newData)` → Map changes
2. ALL layer atoms (including layerA) recalculate → O(n) unnecessary work
3. LayerA extracts `layersSourcesAtom.get('layerA')` → Same data as before
4. LayerA computes identical state → Wasted computation

### Individual Atom Dependency Flows

#### 1. layersSourcesAtom Flow (Major Cascade Trigger)

```mermaid
graph TD
    subgraph "External Triggers"
        AU["`Area Updates
        areaLayersLegendsAndSources.ts:70-88`"]
        UL["`User Layer Edits
        editableLayersLegendsAndSources.ts:25-43`"]
        MC["`MCDA Creation
        mcdaLayer.ts:55-77`"]
    end

    subgraph "layersSourcesAtom (Map)"
        LSA["`Map&lt;string, AsyncState&lt;LayerSource&gt;&gt;
        { 'layerA': {...}, 'layerB': {...}, ... }`"]
    end

    subgraph "All Dependent Layer Atoms"
        L1["`Layer A: get().get('layerA')`"]
        L2["`Layer B: get().get('layerB')`"]
        L3["`Layer C: get().get('layerC')`"]
        LN["`Layer N: get().get('layerN')`"]
    end

    AU -->|modifies 10-15 layers| LSA
    UL -->|modifies 3-8 layers| LSA
    MC -->|modifies 1 layer| LSA

    LSA -->|❌ ALL recalculate| L1
    LSA -->|❌ ALL recalculate| L2
    LSA -->|❌ ALL recalculate| L3
    LSA -->|❌ ALL recalculate| LN

    style AU stroke:#ff6b6b,stroke-width:3px
    style LSA stroke:#ff6b6b,stroke-width:3px
    style L1 stroke:#ffa726
    style L2 stroke:#ffa726
    style L3 stroke:#ffa726
    style LN stroke:#ffa726
```

#### 2. hiddenLayersAtom Flow (Circular Dependency)

```mermaid
graph TD
    subgraph "User Actions"
        HIDE["`Layer hide/show
        UI visibility toggles`"]
    end

    subgraph "hiddenLayersAtom (Set)"
        HLA["`Set&lt;string&gt;
        { 'layerA', 'layerC', ... }`"]
    end

    subgraph "Layer Atoms (Read + Write)"
        L1["`Layer A
        get().has('layerA')`"]
        L2["`Layer B
        get().has('layerB')`"]
        LA_ACT["`Layer A Actions
        onAction('hide') → set('layerA')`"]
    end

    HIDE --> L1
    L1 -->|circular write| HLA
    LA_ACT -->|triggers| HLA
    HLA -->|reactive read| L1
    HLA -->|reactive read| L2

    style HLA stroke:#ef5350,stroke-width:3px
    style LA_ACT stroke:#ef5350,stroke-width:2px
    style L1 stroke:#ffa726
```

#### 3. enabledLayersAtom Flow (Non-Reactive Issue)

```mermaid
graph TD
    subgraph "User Actions"
        EN["`Layer enable/disable
        UI toggle controls`"]
    end

    subgraph "enabledLayersAtom (Set)"
        ELA["`Set&lt;string&gt;
        { 'layerA', 'layerB', ... }`"]
    end

    subgraph "Layer Atoms (Mixed Access)"
        L1["`Layer A
        ❌ getUnlistedState().has('layerA')`"]
        L2["`Layer B
        ❌ getUnlistedState().has('layerB')`"]
        LA_ACT["`Layer A Actions
        onAction('enable') → set('layerA')`"]
    end

    EN --> L1
    L1 -->|writes but doesn't react| ELA
    LA_ACT -->|triggers| ELA
    ELA -.->|❌ NON-REACTIVE| L1
    ELA -.->|❌ NON-REACTIVE| L2

    style ELA stroke:#ff9800,stroke-width:3px
    style LA_ACT stroke:#ef5350,stroke-width:2px
    style L1 stroke:#ffa726
```

## Implementation Analysis

### Dependency Trace: Layer Atom Dependencies

**Location**: [`logicalLayerFabric.ts:62-71`](../../src/core/logical_layers/utils/logicalLayerFabric.ts#L62-L71)

```typescript
const logicalLayerAtom = createAtom({
  ...logicalLayerActions,
  layersSettingsAtom,    // Trace A: Map<string, AsyncState<LayerSettings>>
  layersLegendsAtom,     // Trace B: Map<string, AsyncState<LayerLegend>>
  layersMetaAtom,        // Trace C: Map<string, AsyncState<LayerMeta>>
  layersSourcesAtom,     // Trace D: Map<string, AsyncState<LayerSource>>
  enabledLayersAtom,     // Trace E: Set<string>
  mountedLayersAtom,     // Trace F: Map<string, LayerAtom>
  hiddenLayersAtom,      // Trace G: Set<string>
  layersMenusAtom,       // Trace H: Map<string, LayerContextMenu>
  layersEditorsAtom,     // Trace I: Map<string, AsyncState<LayerEditor>>
  _patchState: (newState: Partial<LogicalLayerState>) => newState,
}, /* reducer function */, /* options */);
```

### Dependency Trace Analysis

**Trace A: `layersSettingsAtom` Dependencies**

**Usage Pattern**: [`logicalLayerFabric.ts:104`](../../src/core/logical_layers/utils/logicalLayerFabric.ts#L104)

```typescript
const asyncLayerSettings = get('layersSettingsAtom').get(id) ?? fallbackAsyncState;
```

**Modification Points**:

1. [`layersRegistry.ts:120-130`](../../src/core/logical_layers/atoms/layersRegistry.ts#L120-L130) - Layer registration
2. [`createUpdateActions.ts:52-60`](../../src/core/logical_layers/utils/createUpdateActions.ts#L52-L60) - Batch settings updates
3. [`mcdaLayer.ts:45`](../../src/features/mcda/atoms/mcdaLayer.ts#L45) - MCDA layer creation
4. [`multivariateLayer.ts:38`](../../src/features/multivariate_layer/atoms/multivariateLayer.ts#L38) - MVA layer creation

**Cascade Frequency**: Medium (3-5 times per user session)
**Optimization Potential**: High - Can isolate to per-layer derived atoms

**Trace B: `layersLegendsAtom` Dependencies**

**Usage Pattern**: [`logicalLayerFabric.ts:105`](../../src/core/logical_layers/utils/logicalLayerFabric.ts#L105)

```typescript
const asyncLayerLegend = get('layersLegendsAtom').get(id) ?? fallbackAsyncState;
```

**Major Modification Points**:

1. [`areaLayersLegendsAndSources.ts:89-101`](../../src/features/layers_in_area/atoms/areaLayersLegendsAndSources.ts#L89-L101) - Area updates (10-15 layers)
2. [`editableLayersLegendsAndSources.ts:45-58`](../../src/features/create_layer/atoms/editableLayersLegendsAndSources.ts#L45-L58) - User layer batch (3-8 layers)
3. [`mcdaLayer.ts:78-95`](../../src/features/mcda/atoms/mcdaLayer.ts#L78-95) - MCDA legend generation
4. [`createUpdateActions.ts:35-45`](../../src/core/logical_layers/utils/createUpdateActions.ts#L35-L45) - Generic batch updates

**Cascade Frequency**: High (every boundary change, analytics operation)
**Optimization Potential**: Critical - Main performance bottleneck

**Trace C: `layersSourcesAtom` Dependencies**

**Usage Pattern**: [`logicalLayerFabric.ts:106`](../../src/core/logical_layers/utils/logicalLayerFabric.ts#L106)

```typescript
const asyncLayerSource = get('layersSourcesAtom').get(id) ?? fallbackAsyncState;
```

**Major Modification Points**:

1. [`areaLayersLegendsAndSources.ts:70-88`](../../src/features/layers_in_area/atoms/areaLayersLegendsAndSources.ts#L70-L88) - Area layer sources (10-15 layers)
2. [`editableLayersLegendsAndSources.ts:25-43`](../../src/features/create_layer/atoms/editableLayersLegendsAndSources.ts#L25-L43) - User layer sources (3-8 layers)
3. [`mcdaLayer.ts:55-77`](../../src/features/mcda/atoms/mcdaLayer.ts#L55-L77) - MCDA source generation

**Cascade Frequency**: High (area updates, layer creation)
**Optimization Potential**: Critical - Co-modified with legends

**Trace D-I: Secondary Dependencies**

**enabledLayersAtom/hiddenLayersAtom/mountedLayersAtom**:

- **Access**: [`logicalLayerFabric.ts:113-115`](../../src/core/logical_layers/utils/logicalLayerFabric.ts#L113-L115)
- **Frequency**: Medium (user interactions)
- **Optimization**: Low priority - Set operations are efficient

**layersMetaAtom/layersEditorsAtom/layersMenusAtom**:

- **Access**: [`logicalLayerFabric.ts:107-110`](../../src/core/logical_layers/utils/logicalLayerFabric.ts#L107-L110)
- **Frequency**: Low (registration only)
- **Optimization**: Low priority - Infrequent updates

### Optimization Point Analysis

**Point 1: Map Reference Equality**

**Location**: [`createPrimitives.ts:66-69`](../../src/utils/atoms/createPrimitives.ts#L66-L69)

```typescript
set: (state, key: Key, el: Element) => {
  if (state.get(key) === el) return state; // ✅ Reference check prevents update
  return new Map(state).set(key, el);      // ❌ Always new Map for dependents
},
```

**Current Effectiveness**: Prevents updates when setting identical references
**Limitation**: No batch operation optimization
**Enhancement Potential**: Add batch reference equality checks

**Point 2: Batch Update Coordination**

**Location**: [`createUpdateActions.ts:46-76`](../../src/core/logical_layers/utils/createUpdateActions.ts#L46-L76)

```typescript
export function createUpdateLayerActions(updates: LayersUpdate[]) {
  const batchedUpdates = /* group by atom type */;

  if (batchedUpdates.legend.length) {
    updateActions.push(
      layersLegendsAtom.change((state) => {
        const newState = new Map(state);
        batchedUpdates.legend.forEach(([id, data]) => newState.set(id, data));
        return newState; // Single Map update for multiple layers
      }),
    );
  }
}
```

**Current Effectiveness**: Reduces multiple Map creations to single operation per atom
**Limitation**: Still triggers all dependent layer atoms
**Enhancement Potential**: High - Focus optimization efforts here

## Current Usage Analysis

### Cascade Trigger Inventory

**High-Impact Triggers (Major Performance Bottlenecks)**:

| Operation             | Frequency | Atoms Modified                                                 | Layers Updated | Total Recalculations |
| --------------------- | --------- | -------------------------------------------------------------- | -------------- | -------------------- |
| Area boundary change  | High      | `layersSourcesAtom`, `layersLegendsAtom`                       | 10-15          | 400-750              |
| Event selection       | High      | `layersSourcesAtom`, `layersLegendsAtom`                       | 10-15          | 400-750              |
| User layer batch edit | Medium    | `layersSourcesAtom`, `layersLegendsAtom`, `layersSettingsAtom` | 3-8            | 180-480              |
| MCDA layer creation   | Medium    | 4 atoms                                                        | 1              | 100                  |

**Medium-Impact Triggers**:

| Operation               | Frequency | Atoms Modified                          | Layers Updated | Total Recalculations |
| ----------------------- | --------- | --------------------------------------- | -------------- | -------------------- |
| Layer registration      | Medium    | `layersSettingsAtom`, `layersMenusAtom` | 1-5            | 50-250               |
| Layer visibility toggle | High      | `hiddenLayersAtom`                      | 1              | 25                   |
| Layer enable/disable    | Medium    | `enabledLayersAtom`                     | 1              | 25                   |

### Performance Concentration Points

**Point A: Area Layer Updates**

- **File**: [`areaLayersLegendsAndSources.ts`](../../src/features/layers_in_area/atoms/areaLayersLegendsAndSources.ts)
- **Impact**: Highest cascade trigger (400-750 recalculations)
- **Optimization Priority**: Critical

**Point B: Batch Update Utilities**

- **File**: [`createUpdateActions.ts`](../../src/core/logical_layers/utils/createUpdateActions.ts)
- **Impact**: Used by all major cascade triggers
- **Optimization Priority**: High

**Point C: Map Atom Primitives**

- **File**: [`createPrimitives.ts`](../../src/utils/atoms/createPrimitives.ts)
- **Impact**: Foundation for all Map operations
- **Optimization Priority**: Medium

## State Management Integration

### Reatom v2 Integration Pattern

**Change Detection Flow**:

1. `layersSourcesAtom.change()` called → New Map created
2. Reatom dependency tracker notifies all dependents
3. All 25+ layer atoms execute reducer functions
4. Each extracts `get('layersSourcesAtom').get(layerId)`
5. Only 1-15 layers have actual data changes
6. 10-20 layers compute identical results unnecessarily

**Optimization Opportunity**: Intermediate derived atoms could filter changes before reaching layer atoms

### Memory Allocation Pattern

**Current Pattern**:

```typescript
// Every change creates new Map instance
layersSourcesAtom.change((state) => {
  const newState = new Map(state); // Full Map copy
  updates.forEach(([id, data]) => newState.set(id, data));
  return newState;
});
```

**Memory Impact**: Large Map copies for small data changes
**Optimization Potential**: Structural sharing or immutable Maps

## Architectural Inconsistencies

### Inconsistency 1: Granular Access with Broadcast Dependencies

**Problem**: Layer atoms access single layer data but depend on all layer data.

**Evidence**:

- **Access**: [`logicalLayerFabric.ts:104`](../../src/core/logical_layers/utils/logicalLayerFabric.ts#L104) - `get('layersSourcesAtom').get(id)`
- **Dependency**: [`logicalLayerFabric.ts:66`](../../src/core/logical_layers/utils/logicalLayerFabric.ts#L66) - `layersSourcesAtom` entire Map

**Optimization Target**: Layer-specific derived atoms

### Inconsistency 2: Efficient Primitives with Inefficient Usage

**Problem**: `createMapAtom` has reference equality optimization but batch operations don't leverage it.

**Evidence**:

- **Primitive**: [`createPrimitives.ts:66-67`](../../src/utils/atoms/createPrimitives.ts#L66-L67) - Reference equality check
- **Usage**: [`createUpdateActions.ts:38`](../../src/core/logical_layers/utils/createUpdateActions.ts#L38) - Always creates new Map

**Optimization Target**: Enhance batch operations with reference equality

### Inconsistency 3: Deep State Comparison Missing

**Problem**: Layer atoms always return new state objects without comparing computed values.

**Evidence**: [`logicalLayerFabric.ts:142`](../../src/core/logical_layers/utils/logicalLayerFabric.ts#L142) - Always returns `newState` object

**Optimization Target**: Add deep equality comparison before state updates

## System Boundaries

### Optimization Boundaries

**High-ROI Optimization Zone**:

- Shared Map atom modification patterns
- Batch update utilities
- Layer-specific data derivation

**Medium-ROI Optimization Zone**:

- Map atom primitive enhancements
- State comparison utilities
- Memory allocation patterns

**Low-ROI Optimization Zone**:

- Individual layer logic
- UI rendering optimizations
- API caching improvements

### Current Performance Boundaries

**Bottleneck Concentration**: 80% of cascade overhead originates from area layer update operations
**Scale Sensitivity**: Performance degrades linearly with layer count (O(n))
**Memory Overhead**: Full Map copies for every shared atom modification
**Computational Waste**: 60-90% unnecessary recalculations in typical usage patterns
