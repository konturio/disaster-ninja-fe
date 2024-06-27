import {
  withDataAtom,
  reatomAsync,
  withErrorAtom,
  withStatusesAtom,
} from '@reatom/async';
import { onConnect } from '@reatom/hooks';
import { atom } from '@reatom/core';
import { getMcdaAxes } from '~core/api/mcda';
import { axisDTOtoAxis } from '~utils/bivariate/helpers/converters/axixDTOtoAxis';
import type { Axis } from '~utils/bivariate';

export const availableBivariateAxisesAtom = atom((ctx) => {
  const axesResult = ctx.spy(fetchMcdaAxes.dataAtom);
  const isPending = ctx.spy(fetchMcdaAxes.pendingAtom) > 0;
  const error = ctx.spy(fetchMcdaAxes.errorAtom);

  let axes: Axis[] | null = null;
  if (Array.isArray(axesResult)) {
    axes = axesResult
      .filter((axis) => axis.quality && axis.quality > 0.5)
      .map((ax) => axisDTOtoAxis(ax));
  }

  return { data: axes, loading: isPending, error: error?.message ?? null };
}, 'availableBivariateAxises');

const fetchMcdaAxes = reatomAsync((ctx) => {
  return getMcdaAxes(ctx.controller);
}, 'fetchMcdaAxes').pipe(withDataAtom(null), withErrorAtom(), withStatusesAtom());

onConnect(fetchMcdaAxes, (ctx) => {
  const axesResult = ctx.get(fetchMcdaAxes.dataAtom);
  const errorRaw = ctx.get(fetchMcdaAxes.errorAtom);
  if (!axesResult?.length || errorRaw) {
    // if no data yet, or if the previous fetch failed, refetch the data
    fetchMcdaAxes(ctx);
  }
});
