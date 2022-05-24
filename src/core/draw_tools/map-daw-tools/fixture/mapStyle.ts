export default {
  layers: [
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
  ],
  sources: {
    'selected-boundaries': {
      type: 'geojson' as const,
      data: {
        type: 'FeatureCollection' as const,
        features: [],
      },
    },
    'hovered-boundaries': {
      type: 'geojson' as const,
      data: {
        type: 'FeatureCollection' as const,
        features: [],
      },
    },
  },
  version: 8,
};
