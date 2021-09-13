const polygonSelectionModes = {
  DrawPolygonMode: 'DrawPolygonMode',
  SelectBoundaryMode: 'SelectBoundaryMode',
  UploadMode: 'UploadMode',
  ViewMode: 'ViewMode',
} as const;

export default {
  map: {
    accessToken: import.meta.env.KC_MAP_TOKEN as string,
    style: 'https://disaster.ninja/tiles/basemap/style_ninja.json',
    centerPoint: {
      center: [41.84, 52.54],
      zoom: 1,
    },
  },
  polygonSelectionModes,
  defaultPolygonSelectionMode: polygonSelectionModes.ViewMode,
};
