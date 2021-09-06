const AppConfig = {
  map: {
    accessToken: process.env.KC_MAP_TOKEN,
    style: process.env.KC_MAP_STYLE,
    centerPoint: {
      center: [41.84, 52.54],
      zoom: 1,
    },
  },
  defaultPolygonSelectionMode: 'ViewMode',
  polygonSelectionModes: [
    'DrawPolygonMode',
    'SelectBoundaryMode',
    'UploadMode',
  ],
};

export default AppConfig;
