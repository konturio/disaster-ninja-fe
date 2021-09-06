const polygonSelectionModes = {
  DrawPolygonMode: 'DrawPolygonMode',
  SelectBoundaryMode: 'SelectBoundaryMode',
  UploadMode: 'UploadMode',
  ViewMode: 'ViewMode',
} as const;

export default {
  map: {
    accessToken: process.env.KC_MAP_TOKEN,
    style: process.env.KC_MAP_STYLE,
    centerPoint: {
      center: [41.84, 52.54],
      zoom: 1,
    },
  },
  polygonSelectionModes,
  defaultPolygonSelectionMode: polygonSelectionModes.ViewMode,
};
