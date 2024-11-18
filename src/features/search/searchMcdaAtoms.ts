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
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { FeatureFlag } from '~core/shared_state';
import { createMCDAConfigFromJSON } from '~features/mcda/utils/openMcdaFile';

export const isMCDASearchEnabled = !!configRepo.get().features[FeatureFlag.LLM_MCDA];

export const fetchMCDAAsyncResource = reatomAsync(
  (ctx, query: string) => getMCDA(query, ctx.controller),
  'fetchMCDA',
).pipe(withDataAtom(null), withErrorAtom(), withStatusesAtom(), withAbort());

export const MCDASuggestionAtom = atom((ctx) => {
  const result = ctx.spy(fetchMCDAAsyncResource.dataAtom);
  const loading = ctx.spy(fetchMCDAAsyncResource.pendingAtom) > 0;
  const error = ctx.spy(fetchMCDAAsyncResource.errorAtom);

  const data = result ? createMCDAConfigFromJSON(result.config) : null;

  return { data, loading, error };
});

export const resetMCDASearchAction = action((ctx) => {
  fetchMCDAAsyncResource.abort(ctx);
  fetchMCDAAsyncResource.dataAtom.reset(ctx);
  fetchMCDAAsyncResource.errorAtom.reset(ctx);
  fetchMCDAAsyncResource.statusesAtom.reset(ctx);
});

export const selectMCDAItemAction = action((ctx) => {
  const config = ctx.get(MCDASuggestionAtom).data;
  if (config) {
    store.dispatch([mcdaLayerAtom.createMCDALayer(config)]);
    notificationServiceInstance.success(
      {
        title: i18n.t('search.upload_analysis', {
          name: config.name,
        }),
      },
      2,
    );
    resetMCDASearchAction(ctx);
  }
});
