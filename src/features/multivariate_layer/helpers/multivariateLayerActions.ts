import { action } from '@reatom/framework';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { store } from '~core/store/store';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { v3ActionToV2 } from '~utils/atoms/v3tov2';
import { MultivariateRenderer } from '~core/logical_layers/renderers/MultivariateRenderer/MultivariateRenderer';
import { getDefaultBivariateTileSource } from '~core/bivariate/getDefaultBivariateTileSource';
import type { MultivariateLayerStyle } from '~core/logical_layers/renderers/stylesConfigs/multivariate/multivariateStyle';
import type { Action } from '@reatom/core-v2';

export const createMultivariateLayer = action((ctx, style: MultivariateLayerStyle) => {
  if (style.type !== 'multivariate') {
    console.error('Incorrect layer configuration: multivariate type expected');
    return;
  }
  const config = style.config;
  const id = config.id;
  const name = config.name;

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
        source: getDefaultBivariateTileSource(),
        style: {
          type: 'multivariate',
          config: config,
        },
      }),
    ),

    // Set layer legend
    layersLegendsAtom.set(
      id,
      createAsyncWrapper({
        id,
        type: 'multivariate',
        config: config,
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
