// FORM https://wiki.openstreetmap.org/wiki/MapCSS/0.2
// TO https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/

/*
 * "casing_line" not exist in mapBox type,
 * but it required for generating additional layer of type "line" (one-type -> one-layer)
 */
export const MAP_CSS_MAPBOX = {
  // Line
  width: {
    type: 'line',
    category: 'paint',
    name: 'line-width',
    valueConverter: 'toNumber',
  },
  'casing-width': {
    type: 'casing_line',
    category: 'paint',
    name: 'line-width',
    valueConverter: 'relativeCasingLineWith',
  },
  color: {
    type: 'line',
    category: 'paint',
    name: 'line-color',
    valueConverter: null,
  },
  'casing-color': {
    type: 'casing_line',
    category: 'paint',
    name: 'line-color',
    valueConverter: null,
  },
  opacity: {
    type: 'line',
    category: 'paint',
    name: 'line-opacity',
    valueConverter: 'toNumber',
  },
  'casing-opacity': {
    type: 'casing_line',
    category: 'paint',
    name: 'line-opacity',
    valueConverter: 'toNumber',
  },
  dashes: {
    type: 'line',
    category: 'paint',
    name: 'line-pattern',
    valueConverter: 'splitByComma',
  },
  'casing-dashes': {
    type: 'casing_line',
    category: 'paint',
    name: 'line-pattern',
    valueConverter: 'splitByComma',
  },
  linecap: {
    type: 'line',
    category: 'layout',
    name: 'line-cap',
    valueConverter: null, // "round" and "square" as is
  },
  'casing-linecap': {
    type: 'casing_line',
    category: 'layout',
    name: 'line-cap',
    valueConverter: null, // "round" and "square" as is
  },
  linejoin: {
    type: 'line',
    category: 'layout',
    name: 'line-join',
    valueConverter: null, // "bevel" and "miter" as is
  },
  'casing-linejoin': {
    type: 'casing_line',
    category: 'layout',
    name: 'line-join',
    valueConverter: null, // "bevel" and "miter" as is
  },
  // fill
  'fill-color': {
    type: 'fill',
    category: 'paint',
    name: 'fill-color',
    valueConverter: null,
  },
  'fill-opacity': {
    type: 'fill',
    category: 'paint',
    name: 'fill-opacity',
    valueConverter: 'toNumber',
  },
  'fill-opacity-complex': {
    type: 'fill',
    category: 'paint',
    name: 'fill-opacity',
    valueConverter: null,
  },

  // symbol
  'icon-image': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-image',
    valueConverter: null,
  },
  'icon-width': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-size',
    valueConverter: 'toNumber',
  },
  'icon-height': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-size', // overwrite icon-width
    valueConverter: 'toNumber',
  },
  'icon-opacity': {
    type: 'symbol',
    category: 'paint',
    name: 'icon-opacity',
    valueConverter: 'toNumber',
  },
  'icon-text-fit': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-text-fit',
    valueConverter: null,
  },
  'text-field': {
    type: 'symbol',
    category: 'layout',
    name: 'text-field',
    valueConverter: null,
  },
  'text-allow-overlap': {
    type: 'symbol',
    category: 'layout',
    name: 'text-allow-overlap',
    valueConverter: null,
  },
  'text-variable-anchor': {
    type: 'symbol',
    category: 'layout',
    name: 'text-variable-anchor',
    valueConverter: null,
  },
  'symbol-placement': {
    type: 'symbol',
    category: 'layout',
    name: 'symbol-placement',
    valueConverter: null,
  },
  'icon-rotate': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-rotate',
    valueConverter: null,
  },
  'symbol-z-order': {
    type: 'symbol',
    category: 'layout',
    name: 'symbol-z-order',
    valueConverter: null,
  },
  'icon-allow-overlap': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-allow-overlap',
    valueConverter: null,
  },
  'icon-rotation-alignment': {
    type: 'symbol',
    category: 'layout',
    name: 'icon-rotation-alignment',
    valueConverter: null,
  },
  // font
  'font-family': {
    type: 'symbol',
    category: 'layout',
    name: 'text-font',
    valueConverter: 'splitByComma',
  },
  'text-font': {
    type: 'symbol',
    category: 'layout',
    name: 'text-font',
    valueConverter: 'splitByComma',
  },
  'font-size': {
    type: 'symbol',
    category: 'layout',
    name: 'text-size',
    valueConverter: 'toNumber',
  },
  'font-weight': {
    type: 'symbol',
    category: 'paint',
    name: 'text-halo-width',
    valueConverter: null,
  },
  // "font-style": { // * Not supported
  //   "type": "symbol",
  // },
  // "font-variant": { // * Not supported
  //   "type": "symbol",
  // },
  // "text-decoration": { // * Not supported
  //   "type": "symbol",
  // },
  'text-transform': {
    type: 'symbol',
    category: 'layout',
    name: 'text-transform',
    valueConverter: null,
  },
  'text-color': {
    type: 'symbol',
    category: 'paint',
    name: 'text-color',
    valueConverter: null,
  },
  'text-opacity': {
    type: 'symbol',
    category: 'paint',
    name: 'text-opacity',
    valueConverter: 'toNumber',
  },
  'text-position': {
    type: 'symbol',
    category: 'layout',
    name: 'symbol-placement',
    valueConverter: 'convertPlacement',
  },
  'text-offset': {
    type: 'symbol',
    category: 'layout',
    name: 'text-offset',
    valueConverter: 'convertOffset',
  },
  'max-width': {
    type: 'symbol',
    category: 'layout',
    name: 'text-max-width',
    valueConverter: 'toNumber',
  },
  text: {
    type: 'symbol',
    category: 'layout',
    name: 'text-field',
    valueConverter: null,
  },
  'text-halo-color': {
    type: 'symbol',
    category: 'paint',
    name: 'text-halo-color',
    valueConverter: null,
  },
  'text-halo-radius': {
    type: 'symbol',
    category: 'paint',
    name: 'text-halo-width',
    valueConverter: null,
  },
  'text-size': {
    type: 'symbol',
    category: 'layout',
    name: 'text-size',
    valueConverter: null,
  },
  // Extra
  offset: [
    {
      type: 'line',
      category: 'paint',
      name: 'line-offset',
      valueConverter: 'toNumber',
    },
    {
      type: 'casing_line',
      category: 'paint',
      name: 'line-offset',
      valueConverter: 'applyCasingOffset',
    },
  ],
  'casing-offset': null, // used only in value converter acceptCasingOffset
  'circle-color': {
    type: 'circle',
    category: 'paint',
    name: 'circle-color',
  },
  'circle-blur': {
    type: 'circle',
    category: 'paint',
    name: 'circle-blur',
  },
  'circle-opacity': {
    type: 'circle',
    category: 'paint',
    name: 'circle-opacity',
  },
  'circle-radius': {
    type: 'circle',
    category: 'paint',
    name: 'circle-radius',
  },
  'circle-stroke-color': {
    type: 'circle',
    category: 'paint',
    name: 'circle-stroke-color',
  },
  'circle-stroke-opacity': {
    type: 'circle',
    category: 'paint',
    name: 'circle-stroke-opacity',
  },
  'circle-stroke-width': {
    type: 'circle',
    category: 'paint',
    name: 'circle-stroke-width',
  },
  'circle-translate': {
    type: 'circle',
    category: 'paint',
    name: 'circle-translate',
  },
  'circle-translate-anchor': {
    type: 'circle',
    category: 'paint',
    name: 'circle-translate-anchor',
  },
};
