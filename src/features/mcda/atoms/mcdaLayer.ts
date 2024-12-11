import { createAtom } from '~utils/atoms';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { BivariateRenderer } from '~core/logical_layers/renderers/BivariateRenderer/BivariateRenderer';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { configRepo } from '~core/config';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import { layersEditorsAtom } from '~core/logical_layers/atoms/layersEditors';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { i18n } from '~core/localization';
import {
  DEFAULT_GREEN,
  DEFAULT_RED,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import {
  FALLBACK_BIVARIATE_MAX_ZOOM,
  FALLBACK_BIVARIATE_MIN_ZOOM,
} from '~core/logical_layers/renderers/BivariateRenderer/constants';
import { getMaxMCDAZoomLevel } from '~core/logical_layers/renderers/stylesConfigs/mcda/helpers/getMaxZoomLevel';
import { MCDALayerEditor } from '../components/MCDALayerEditor';
import { generateHclGradientColors } from '../utils/generateHclGradientColors';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Action } from '@reatom/core-v2';

export const mcdaLayerAtom = createAtom(
  {
    createMCDALayer: (json: MCDAConfig) => json,
    enableMCDALayer: (layerId: string) => layerId,
    disableMCDALayer: () => null,
  },
  ({ onAction, schedule, getUnlistedState, create }) => {
    onAction('createMCDALayer', (json) => {
      const id = json.id;
      const name = json.name;
      let legendColors: string[] | undefined;
      if (json.colors.type === 'sentiments') {
        const colorGood = json.colors.parameters?.good ?? DEFAULT_GREEN;
        const colorBad = json.colors.parameters?.bad ?? DEFAULT_RED;
        /* TODO: using midpoints for gradient customization is a temporary solution.
        It will probably be removed in the future in favor of working with Color Manager */
        const colorMidpoints =
          json.colors.parameters?.midpoints?.map(
            (point) => `${point.color} ${point.value * 100}%`,
          ) ?? null;
        if (colorMidpoints?.length) {
          legendColors = [colorBad.toString(), ...colorMidpoints, colorGood.toString()];
        } else {
          legendColors = generateHclGradientColors(
            colorBad.toString(),
            colorGood.toString(),
            5,
          );
        }
      }
      const maxZoomLevel = getMaxMCDAZoomLevel(json);

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
            maxZoom: maxZoomLevel !== -1 ? maxZoomLevel : FALLBACK_BIVARIATE_MAX_ZOOM,
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
              type: 'mcda',
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
          renderer: new BivariateRenderer({ id }),
        }),
        mcdaLayerAtom.enableMCDALayer(id),
      ];

      if (actions.length) {
        schedule((dispatch) => {
          dispatch(actions);
        });
      }
    });

    onAction('enableMCDALayer', (id: string) => {
      const currentRegistry = getUnlistedState(layersRegistryAtom);
      const layer = currentRegistry.get(id);
      if (layer?.getState().id === id) {
        schedule((dispatch) => {
          dispatch(layer.enable());
        });
      }
    });

    onAction('disableMCDALayer', () => {
      const currentRegistry = getUnlistedState(layersRegistryAtom);
      schedule((dispatch, ctx: { mcdaLayerAtomId?: string } = {}) => {
        if (ctx.mcdaLayerAtomId) {
          const layerAtom = currentRegistry.get(ctx.mcdaLayerAtomId);
          layerAtom && dispatch(layerAtom.destroy());
        }
      });
    });
  },
  'mcdaLayer',
);
