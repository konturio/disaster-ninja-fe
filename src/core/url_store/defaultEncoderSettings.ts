export const defaultEncoderSettings = {
  order: ['map', 'app', 'event', 'feed', 'layers'], // Doc #1168
  transformers: {
    map: {
      decode: (str: string) => str.split('/').map((s) => Number(s)),
      encode: (position: [number, number, number]) => position.join('/'),
    },
    layers: {
      decode: (str: string) => str.split(','),
      encode: (layers: string[]) => (layers.length ? layers.join(',') : null), // null means - not add this parameter
    },
  },
};
