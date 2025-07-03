import { reatomResource, withDataAtom } from '@reatom/framework';
import { getBoundaries } from '~core/api/boundaries';
import { clickCoordinatesAtom } from './clickCoordinatesAtom';

export const fetchBoundariesAsyncResource = reatomResource(async (ctx) => {
  const coordinates = ctx.spy(clickCoordinatesAtom);

  if (!coordinates) {
    return null;
  }

  return await getBoundaries([coordinates.lng, coordinates.lat], ctx.controller);
}, 'fetchBoundariesAsyncResource').pipe(withDataAtom(null));
