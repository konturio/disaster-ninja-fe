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

export const isMCDASearchEnabled = !!configRepo.get().features[FeatureFlag.LLM_MCDA];

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

export const resetMCDASearchAction = action((ctx) => {
  fetchMCDAAsyncResource.dataAtom.reset(ctx);
  fetchMCDAAsyncResource.errorAtom.reset(ctx);
  fetchMCDAAsyncResource.statusesAtom.reset(ctx);
});

export const selectMCDAItemAction = action((ctx) => {
  const json = ctx.get(MCDAAtom).data;
  if (json?.config) {
    store.dispatch([mcdaLayerAtom.createMCDALayer(json.config)]);
    notificationServiceInstance.success(
      {
        title: i18n.t('search.upload_analysis', {
          name: json.config.name,
        }),
      },
      2,
    );
    resetMCDASearchAction(ctx);
  }
});
