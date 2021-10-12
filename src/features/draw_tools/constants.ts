export const DRAW_MODE_CONFIG = {
  DrawPolygonMode: {
    disableSelfIntersections: true,
  },
};

export const polygonSelectionModes = {
  DrawPolygonMode: 'DrawPolygonMode',
  SelectBoundaryMode: 'SelectBoundaryMode',
  UploadMode: 'UploadMode',
  ViewMode: 'ViewMode',
} as const;

export const DRAW_TOOLS_CONTROLS = Object.values(polygonSelectionModes);

export const defaultPolygonSelectionMode = polygonSelectionModes.ViewMode;

export const boundaryLayers = [
  {
    id: 'hovered-boundaries-layer',
    type: 'line' as const,
    source: 'hovered-boundaries',
    paint: {
      'line-color': 'black',
      'line-width': 1,
      'line-opacity': 0.7,
    },
  },
  {
    id: 'selected-boundaries-layer',
    type: 'line' as const,
    source: 'selected-boundaries',
    paint: {
      'line-color': 'black',
      'line-width': 4,
      'line-opacity': 0.7,
    },
  },
];
