import {
  withDataAtom,
  reatomAsync,
  withErrorAtom,
  withStatusesAtom,
} from '@reatom/async';
import { onConnect } from '@reatom/hooks';
import { atom } from '@reatom/core';
import { getBivariateAxes } from '~core/api/mcda';
import { axisDTOtoAxis } from '~utils/bivariate/helpers/converters/axisDTOtoAxis';
import type { Axis } from '~utils/bivariate';

export const availableBivariateAxesAtom = atom((ctx) => {
  const axesResult = ctx.spy(bivariateAxesAsyncResource.dataAtom);
  const isPending = ctx.spy(bivariateAxesAsyncResource.pendingAtom) > 0;
  const error = ctx.spy(bivariateAxesAsyncResource.errorAtom);

  let axes: Axis[] | null = null;
  if (Array.isArray(axesResult)) {
    axes = axesResult
      .filter((axis) => axis.quality && axis.quality > 0.5)
      .map((ax) => axisDTOtoAxis(ax));
  }

  return { data: axes, loading: isPending, error: error?.message ?? null };
}, 'availableBivariateAxesAtom');

const bivariateAxesAsyncResource = reatomAsync((ctx) => {
  return getBivariateAxes(ctx.controller);
}, 'bivariateAxesAsyncResource').pipe(
  withDataAtom(null),
  withErrorAtom(),
  withStatusesAtom(),
);

onConnect(bivariateAxesAsyncResource, (ctx) => {
  const axesResult = ctx.get(bivariateAxesAsyncResource.dataAtom);
  const errorRaw = ctx.get(bivariateAxesAsyncResource.errorAtom);
  if (!axesResult?.length || errorRaw) {
    // if no data yet, or if the previous fetch failed, refetch the data
    bivariateAxesAsyncResource(ctx);
  }
});
