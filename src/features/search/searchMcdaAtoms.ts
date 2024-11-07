import {
  action,
  atom,
  reatomAsync,
  withAbort,
  withDataAtom,
  withErrorAtom,
  withStatusesAtom,
} from '@reatom/framework';
import { getMCDA } from '~core/api/search';
import { store } from '~core/store/store';
import { mcdaLayerAtom } from '~features/mcda/atoms/mcdaLayer';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export const fetchMCDAAsyncResource = reatomAsync(
  (ctx, query: string) => getMCDA(query, ctx.controller),
  'fetchMCDA',
).pipe(withDataAtom(null), withErrorAtom(), withStatusesAtom(), withAbort());

export const MCDAAtom = atom((ctx) => {
  const data = ctx.spy(fetchMCDAAsyncResource.dataAtom);
  const loading = ctx.spy(fetchMCDAAsyncResource.pendingAtom) > 0;
  const error = ctx.spy(fetchMCDAAsyncResource.errorAtom);

  return { data, loading, error };
});

export const showAnalysis = action((ctx) => {
  const json = ctx.get(MCDAAtom).data;
  if (json?.config) {
    store.dispatch([mcdaLayerAtom.createMCDALayer(json.config)]);
  }
});
