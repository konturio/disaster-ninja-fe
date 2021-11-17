/**
 * Show feature if property 'zoom' === current map zoom
 * OR
 * Show feature if current zoom >= 10 and feature zoom prop === 10
 */
const FILTER = [
  'any',
  ['==', ['number', ['get', 'zoom']], ['zoom']],
  ['all', ['>=', ['zoom'], 12], ['==', ['number', ['get', 'zoom']], 12]],
];

const expression = {
  if: (condition) => ({
    // eslint-disable-next-line no-shadow
    then: (expression) => ({
      else: (fallback) => [
        'case',
        condition,
        ['literal', expression],
        ['literal', fallback],
      ],
    }),
  }),
};

export function createActiveContributorsLayers(sourceId: string) {
  return [
    {
      type: 'symbol',
      source: sourceId,
      'source-layer': 'users',
      filter: FILTER,
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'text-color': expression
          .if(['get', 'is_local'])
          .then('rgb(0, 145, 0)')
          .else('rgb(45, 45, 45)'),
        'text-halo-color': 'rgba(255, 255, 255, 0.3)',
        'text-halo-width': 2,
      },
      layout: {
        'text-field': ['get', 'top_user'],
        'text-font': expression
          .if(['get', 'is_local'])
          .then(['Noto Sans Bold'])
          .else(['Noto Sans Regular']),
        'text-size': expression.if(['get', 'is_local']).then(14).else(12),
        // "text-transform": "uppercase",
        'text-letter-spacing': 0.05,
        // "text-offset": [0, 1.5]
      },
      transition: {
        duration: 0,
        delay: 0,
      },
    },
    {
      type: 'line',
      source: sourceId,
      'source-layer': 'hexagon',
      filter: FILTER,
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'line-color': `rgb(0, 0, 0)`,
        'line-opacity': 0.2,
      },
    },
    {
      type: 'line',
      source: sourceId,
      'source-layer': 'hexagon',
      filter: FILTER,
      minzoom: 0,
      maxzoom: 22,
      paint: {
        'line-color': `rgb(255, 255, 255)`,
        'line-opacity': 0.2,
        'line-width': 3,
      },
    },
  ];
}
