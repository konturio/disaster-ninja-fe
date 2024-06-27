import { atom } from '@reatom/core';
import { bivariateStatisticsResourceAtom } from '~core/resources/bivariateStatisticsResource';

export const availableBivariateAxisesAtomOld = atom((ctx) => {
  const axisesResource = ctx.spy(bivariateStatisticsResourceAtom.v3atom);
  if (axisesResource.loading) {
    return {
      loading: true,
      data: null,
      error: null,
    };
  }

  if (axisesResource.error) {
    return {
      loading: false,
      data: null,
      error: axisesResource.error,
    };
  }

  if (axisesResource.data) {
    const prepared =
      axisesResource.data?.axis
        // Remove low quality axes
        .filter((a) => a.quality && a.quality > 0.5) ?? [];
    return {
      loading: false,
      data: prepared,
      error: null,
    };
  }

  return {
    loading: false,
    data: [],
    error: null,
  };
}, 'availableBivariateAxisesOld');
