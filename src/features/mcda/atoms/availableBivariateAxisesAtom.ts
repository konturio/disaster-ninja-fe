import { reatomResource, withDataAtom, withRetry, withStatusesAtom } from '@reatom/async';
import { onConnect } from '@reatom/hooks';
import { getMcdaAxes } from '~core/api/mcda';
import { axisDTOtoAxis } from '~utils/bivariate/helpers/converters/axixDTOtoAxis';
import type { Axis } from '~utils/bivariate';

type AvailableAxisesResult = {
  data: Axis[] | null;
  loading: boolean;
  error: string | null;
};

export const availableBivariateAxisesAtom = reatomResource<AvailableAxisesResult>(
  async (ctx) => {
    return await ctx.schedule(async () => {
      let axes: Axis[] | null = null;
      let error: string | null = null;
      try {
        const axesDTO = await getMcdaAxes();
        if (Array.isArray(axesDTO)) {
          axes = axesDTO
            .filter((axis) => axis.quality && axis.quality > 0.5)
            .map((ax) => axisDTOtoAxis(ax));
        }
      } catch (e) {
        // console.log(e);
        error = (e as Error).message;
      }

      return { data: axes, loading: false, error: error };
    });
  },
  'availableBivariateAxises',
).pipe(withDataAtom({ data: null, loading: true, error: null }), withRetry());

onConnect(availableBivariateAxisesAtom, (ctx) => {
  const data = ctx.get(availableBivariateAxisesAtom.dataAtom);
  // console.log('onConnect', {data});
  if (!data.loading && (data?.error || !data.data)) {
    // console.log('retry!', data);
    availableBivariateAxisesAtom.dataAtom.reset(ctx);
    availableBivariateAxisesAtom.retry(ctx);
  }
});
