import { URL_ZOOM_OFFSET } from '~core/constants';
import { isValidLngLat } from '~core/map/utils/coordinateValidation';
import { URLDataInSearchEncoder } from './dataInURLEncoder';

type MapPosition = [zoom: number, lat: number, lng: number];
type BBox = [[number, number], [number, number]];

export const urlEncoder = new URLDataInSearchEncoder({
  order: ['map', 'app', 'event', 'feed', 'layers'], // Doc #1168
  transformers: {
    map: {
      decode: (str: string): MapPosition | undefined => {
        const position = str.split('/').map((s) => Number(s) + 0); // normalize -0/+0
        const [zoom, lat, lng] = position;
        if (!isValidLngLat(lng, lat)) return undefined;
        if (zoom < 0 || zoom > 24) return undefined;
        position[0] = zoom - URL_ZOOM_OFFSET;
        return [zoom - URL_ZOOM_OFFSET, lat, lng];
      },
      encode: (position: MapPosition): string => {
        const [zoom, lat, lng] = position;
        const precision = Math.max(3, Math.ceil(Math.log(zoom) / Math.LN2));
        const formatCoordinate = (n: number) => {
          const fixedPointNumber = Number(n.toFixed(precision));
          // convert -0 to 0 if needed
          return (Object.is(fixedPointNumber, -0) ? 0 : fixedPointNumber).toFixed(
            precision,
          );
        };
        return [
          (zoom + URL_ZOOM_OFFSET).toFixed(3),
          formatCoordinate(lat),
          formatCoordinate(lng),
        ].join('/');
      },
    },
    bbox: {
      decode: (str: string): BBox => {
        const coords = str.split(',').map((coord) => Number.parseFloat(coord.trim()) + 0);
        return [
          [coords[0], coords[1]],
          [coords[2], coords[3]],
        ];
      },
      encode: (bbox: BBox): string => {
        const normalizedBbox = [
          [bbox[0][0] + 0, bbox[0][1] + 0],
          [bbox[1][0] + 0, bbox[1][1] + 0],
        ];
        return `${normalizedBbox[0][0]},${normalizedBbox[0][1]},${normalizedBbox[1][0]},${normalizedBbox[1][1]}`;
      },
    },
    layers: {
      decode: (str: string): string[] => str.split(','),
      encode: (layers: string[]): string | null =>
        layers.length ? layers.join(',') : null, // null means - not add this parameter
    },
  },
});
