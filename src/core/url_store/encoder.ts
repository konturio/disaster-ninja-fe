import { URL_ZOOM_OFFSET } from '~core/constants';
import { URLDataInSearchEncoder } from './dataInURLEncoder';

export const urlEncoder = new URLDataInSearchEncoder({
  order: ['map', 'app', 'event', 'feed', 'layers'], // Doc #1168
  transformers: {
    map: {
      decode: (str: string) => {
        const position = str.split('/').map((s) => Number(s));
        const [zoom, lat, lng] = position;
        if (lat < -90 || lat > 90) return undefined;
        if (lng < -180 || lng > 180) return undefined;
        if (zoom < 0 || zoom > 24) return undefined;
        position[0] = zoom - URL_ZOOM_OFFSET;
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
    bbox: {
      decode: (str: string) => {
        const coords = str.split(',').map((coord) => parseFloat(coord.trim()));
        return [
          [coords[0], coords[1]],
          [coords[2], coords[3]],
        ];
      },
      encode: (bbox: [[number, number], [number, number]]) => {
        return `${bbox[0][0]},${bbox[0][1]},${bbox[1][0]},${bbox[1][1]}`;
      },
    },
    layers: {
      decode: (str: string) => str.split(','),
      encode: (layers: string[]) => (layers.length ? layers.join(',') : null), // null means - not add this parameter
    },
  },
});
