# Current Tooltip and Popup Implementation Status

## Overview

This report summarizes the current usage of tooltips and popups in the codebase, highlights components already migrated to `SimpleTooltip`, identifies remaining components using the legacy global popup system (`PopupTooltip`, `PopupTooltipTrigger`, `PopupTooltipWrapper`, `currentTooltipAtom`), and lists required migrations and deprecations.

## 1. Already Using SimpleTooltip (No Action Required)

These components use non-interactive, hover-triggered tooltips via `SimpleTooltip`:

- [ToolbarButton](../../src/features/toolbar/components/ToolbarButton/ToolbarButton.tsx) — Toolbar button hint
- [ShortToolbarButton](../../src/features/toolbar/components/ShortToolbarButton/ShortToolbarButton.tsx) — Compact toolbar button hint
- [NavButton](../../src/features/side_bar/components/SideBar/NavButton.tsx) — Sidebar navigation labels
- [ToggleButton](../../src/features/side_bar/components/SideBar/ToggleButton.tsx) — Sidebar toggle hint
- [ReferenceAreaInfo](../../src/features/user_profile/components/SettingsForm/ReferenceAreaInfo/ReferenceAreaInfo.tsx) — Reference-area info
- [Analytics](../../src/features/events_list/components/EventCard/Analytics/Analytics.tsx) — Analytics icon hint
- [DenominatorIcon](../../src/features/bivariate_manager/components/BivariateMatrixControl/components/DenominatorIcon/DenominatorIcon.tsx) — Denominator cell info
- [SeverityIndicator](../../src/components/SeverityIndicator/SeverityIndicator.tsx) — Severity icon description
- [IconButton](../../src/components/Uni/Components/IconButton.tsx) — Generic icon buttons
- [Severity](../../src/components/Uni/Components/Severity.tsx) — Severity component helper
- [Field](../../src/components/Uni/Components/Field.tsx) — Form field helper
- [LabelWithTooltip](../../src/components/LabelWithTooltip/LabelWithTooltip.tsx) — Labeled form fields
- [LayerActionIcon](../../src/components/LayerActionIcon/LayerActionIcon.tsx) — Layer action controls

---

## 2. Legacy Global PopupTooltip System

### PopupTooltip Component

- [PopupTooltip](../../src/features/tooltip/components/PopupTooltip/PopupTooltip.tsx) — Global tooltip renderer
- [CommonView](../../src/views/CommonView.tsx) — `<PopupTooltip/>` mounted at app root

### PopupTooltipTrigger (Click or Hover)

- [PopupTooltipTrigger](../../src/components/PopupTooltipTrigger/PopupTooltipTrigger.tsx) — Core trigger wrapper
- [LayerInfo](../../src/components/LayerInfo/LayerInfo.tsx) — Layer metadata popup
- [MCDALayerParameters](../../src/features/mcda/components/MCDALayerEditor/MCDALayerParameters/MCDALayerParameters.tsx) — MCDA parameter info
- [MCDALayerParameterRow](../../src/features/mcda/components/MCDALayerEditor/MCDALayerParameters/MCDALayerParameterRow/MCDALayerParameterRow.tsx) — MCDA parameter row help

### PopupTooltipWrapper (Hover/Click Delegation)

- [PopupTooltipWrapper](../../src/components/PopupTooltipTrigger/PopupTooltipWrapper.tsx) — Legacy wrapper
- [AxisCaptions](../../src/features/bivariate_manager/components/BivariateMatrixControl/components/AxisCaptions/AxisCaptions.tsx) — Axis captions info
- [CornerTooltipWrapper](../../src/components/BivariateLegend/CornerTooltipWrapper.tsx) — Legend corner tips

### Shared State Atom

- [currentTooltipAtom](../../src/core/shared_state/currentTooltip.ts) — Global state for PopupTooltip

---

## 3. Custom Map Overlay

- [MapHexTooltip](../../src/components/MapHexTooltip/MapHexTooltip.tsx) — Bivariate hex popup content (Migration Target: `Popover`)

---

## 4. Test Fixtures Still Rendering `<PopupTooltip/>`

- [BivariateMatrixControl.fixture.tsx](../../src/features/bivariate_manager/fixtures/BivariateMatrixControl.fixture.tsx)
- [BivariateLegend.fixture.tsx](../../src/components/BivariateLegend/BivariateLegend.fixture.tsx)

---

## 5. Migration Targets

- [MapHexTooltip](../../src/components/MapHexTooltip/MapHexTooltip.tsx) — Custom overlay → `Popover`
- [PopupTooltip](../../src/features/tooltip/components/PopupTooltip/PopupTooltip.tsx) — Global popup system → Remove & migrate triggers
- [CommonView](../../src/views/CommonView.tsx) — `<PopupTooltip/>` mount → Unmount; wrap triggers individually
- [LayerInfo](../../src/components/LayerInfo/LayerInfo.tsx) — `PopupTooltipTrigger` → `<Popover trigger="click">`
- [MCDALayerParameters](../../src/features/mcda/components/MCDALayerEditor/MCDALayerParameters/MCDALayerParameters.tsx) — `PopupTooltipTrigger` → `<Popover trigger="click">`
- [MCDALayerParameterRow](../../src/features/mcda/components/MCDALayerEditor/MCDALayerParameters/MCDALayerParameterRow/MCDALayerParameterRow.tsx) — `PopupTooltipTrigger` → `<Popover trigger="click">`
- [AxisCaptions](../../src/features/bivariate_manager/components/BivariateMatrixControl/components/AxisCaptions/AxisCaptions.tsx) — `PopupTooltipWrapper` → `<Popover>`
- [CornerTooltipWrapper](../../src/components/BivariateLegend/CornerTooltipWrapper.tsx) — `PopupTooltipWrapper` → `SimpleTooltip`
- [ProgressTooltip](../../src/features/bivariate_manager/components/ProgressTooltip/ProgressTooltip.tsx) — Custom interactive tooltip → `<Popover>`

---

## 6. Deprecations (Post-Migration)

- Remove `currentTooltipAtom`, `PopupTooltipTrigger`, `PopupTooltipWrapper`, and related CSS/modules
- Remove global `<PopupTooltip/>` mount in `CommonView`
- Clean up `@konturio/ui-kit/Tooltip` imports and transition wrappers

---

## 7. Next Steps

1. Triage non-interactive hover cases (CornerTooltipWrapper) → migrate to `SimpleTooltip`
2. Implement and validate interactive overlays with `Popover` (LayerInfo, MCDA panels, AxisCaptions, ProgressTooltip)
3. Remove legacy global system and shared-state atoms
4. Update `src/core/tooltips/index.ts` to only re-export `@konturio/floating` components and the new `Popover` API
