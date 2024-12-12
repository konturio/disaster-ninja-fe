import { action } from '@reatom/framework';
import { configRepo } from '~core/config';
import { layersEditorsAtom } from '~core/logical_layers/atoms/layersEditors';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import {
  FALLBACK_BIVARIATE_MAX_ZOOM,
  FALLBACK_BIVARIATE_MIN_ZOOM,
} from '~core/logical_layers/renderers/BivariateRenderer/constants';
import { store } from '~core/store/store';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { v3ActionToV2 } from '~utils/atoms/v3tov2';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import { MultivariateRenderer } from '~core/logical_layers/renderers/MultivariateRenderer/MultivariateRenderer';
import { MultivariateLayerEditor } from '../components/MultivariateLayerEditor/MultivariateLayerEditor';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';
import type { Action } from '@reatom/core-v2';

export const createMultivariateLayer = action((ctx, config: MultivariateLayerConfig) => {
  const id = config.id;
  const name = config.name;
  const json = config;

  const actions: Array<Action> = [
    // Set layer settings once
    layersSettingsAtom.set(
      id,
      createAsyncWrapper({
        name,
        id,
        category: 'overlay' as const,
        group: 'bivariate',
        ownedByUser: true,
      }),
    ),

    // Set layer source
    layersSourcesAtom.set(
      id,
      createAsyncWrapper({
        id,
        maxZoom: FALLBACK_BIVARIATE_MAX_ZOOM,
        minZoom: FALLBACK_BIVARIATE_MIN_ZOOM,
        source: {
          type: 'vector' as const,
          urls: [
            `${adaptTileUrl(
              configRepo.get().bivariateTilesRelativeUrl,
            )}{z}/{x}/{y}.mvt?indicatorsClass=${
              configRepo.get().bivariateTilesIndicatorsClass
            }`,
          ],
          tileSize: 512,
          apiKey: '',
        },
        style: {
          type: 'multivariate',
          config: json,
        },
      }),
    ),

    // Set layer legend
    layersLegendsAtom.set(
      id,
      createAsyncWrapper({
        id,
        type: 'multivariate',
      }),
    ),

    // Set layer editor
    layersEditorsAtom.set(
      id,
      createAsyncWrapper({
        id,
        type: 'multivariate',
        component: MultivariateLayerEditor,
      }),
    ),

    // Register and Enable
    layersRegistryAtom.register({
      id,
      renderer: new MultivariateRenderer({ id }),
    }),
    v3ActionToV2(enableMultivariateLayer, id, 'enableMCDALayer'),
  ];

  if (actions.length) {
    store.dispatch(actions);
  }
}, 'createMultivariateLayer');

export const enableMultivariateLayer = action((ctx, id: string) => {
  const currentRegistry = ctx.get(layersRegistryAtom.v3atom);
  const layer = currentRegistry.get(id);
  if (layer?.getState().id === id) {
    store.dispatch(layer.enable());
  }
}, 'enableMultivariateLayer');
