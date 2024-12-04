import { action } from '@reatom/framework';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import { layersEditorsAtom } from '~core/logical_layers/atoms/layersEditors';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import {
  FALLBACK_BIVARIATE_MAX_ZOOM,
  FALLBACK_BIVARIATE_MIN_ZOOM,
} from '~core/logical_layers/renderers/BivariateRenderer/constants';
import {
  DEFAULT_GREEN,
  DEFAULT_RED,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { store } from '~core/store/store';
import { MCDALayerEditor } from '~features/mcda/components/MCDALayerEditor';
import { generateHclGradientColors } from '~features/mcda/utils/generateHclGradientColors';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { v3ActionToV2 } from '~utils/atoms/v3tov2';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import { MultivariateRenderer } from '~core/logical_layers/renderers/MultivariateRenderer/MultivariateRenderer';
import type { MCDALayerStyle } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';
import type { Action } from '@reatom/core-v2';

export const createMultivariateLayer = action((ctx, config: MultivariateLayerConfig) => {
  const id = config.id;
  const name = config.name;
  let legendColors: string[] | undefined;
  // const json = (config.base as MCDALayerStyle).config;
  const json = config;
  // if (json.colors.type === 'sentiments') {
  //   const colorGood = json.colors.parameters?.good ?? DEFAULT_GREEN;
  //   const colorBad = json.colors.parameters?.bad ?? DEFAULT_RED;
  //   /* TODO: using midpoints for gradient customization is a temporary solution.
  //   It will probably be removed in the future in favor of working with Color Manager */
  //   const colorMidpoints =
  //     json.colors.parameters?.midpoints?.map(
  //       (point) => `${point.color} ${point.value * 100}%`,
  //     ) ?? null;
  //   if (colorMidpoints?.length) {
  //     legendColors = [colorBad.toString(), ...colorMidpoints, colorGood.toString()];
  //   } else {
  //     legendColors = generateHclGradientColors(
  //       colorBad.toString(),
  //       colorGood.toString(),
  //       5,
  //     );
  //   }
  // }

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
        type: 'mcda',
        title: i18n.t('mcda.legend_title'),
        subtitle: i18n.t('mcda.legend_subtitle'),
        colors: legendColors,
        steps: 5,
      }),
    ),

    // Set layer editor
    layersEditorsAtom.set(
      id,
      createAsyncWrapper({
        id,
        type: 'mcda',
        component: MCDALayerEditor,
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
