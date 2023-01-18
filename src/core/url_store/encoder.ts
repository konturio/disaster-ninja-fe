import { URL_ZOOM_OFFSET } from '~core/constants';
import { URLDataInSearchEncoder } from './dataInURLEncoder';

export const urlEncoder = new URLDataInSearchEncoder({
  order: ['map', 'app', 'event', 'feed', 'layers'], // Doc #1168
  transformers: {
    map: {
      decode: (str: string) => {
        const position = str.split('/').map((s) => Number(s));
        const zoom = position[0] - URL_ZOOM_OFFSET
        position[0] = zoom;
        return position;
      },
      encode: (position: [number, number, number]) => {
        const [zoom, lat, lng] = position;
        const precision = Math.max(3, Math.ceil(Math.log(zoom) / Math.LN2));
        return [
          (zoom + URL_ZOOM_OFFSET).toFixed(3),
          lat.toFixed(precision),
          lng.toFixed(precision),
        ].join('/');
      },
    },
    layers: {
      decode: (str: string) => str.split(','),
      encode: (layers: string[]) => (layers.length ? layers.join(',') : null), // null means - not add this parameter
    },
  },
});
