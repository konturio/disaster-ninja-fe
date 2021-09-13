const polygonSelectionModes = {
  DrawPolygonMode: 'DrawPolygonMode',
  SelectBoundaryMode: 'SelectBoundaryMode',
  UploadMode: 'UploadMode',
  ViewMode: 'ViewMode',
} as const;

export default {
  map: {
    accessToken: import.meta.env.KC_MAP_TOKEN,
    style: import.meta.env.KC_MAP_STYLE,
    centerPoint: {
      center: [41.84, 52.54],
      zoom: 1,
    },
  },
  polygonSelectionModes,
  defaultPolygonSelectionMode: polygonSelectionModes.ViewMode,
};
