import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

/* Async load image on mao */
export const loadImageOnMap = (map: ApplicationMap, url: string) =>
  new Promise<ImageData>((res, rej) => {
    map.loadImage(url, (error, image) => {
      if (error) return rej(error);
      res(image);
    });
  });
