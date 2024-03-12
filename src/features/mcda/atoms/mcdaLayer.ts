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
import { MCDALayerEditor } from '../components/MCDALayerEditor';
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

      const actions: Array<Action> = [
        // Set layer settings once
        layersSettingsAtom.set(
          id,
          createAsyncWrapper({
            name: id,
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
            maxZoom: 22,
            minZoom: 0,
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
      ];

      if (actions.length) {
        schedule((dispatch) => {
          dispatch(actions);
        });
      }
    });

    onAction('enableMCDALayer', (id: string) => {
      const currentRegistry = getUnlistedState(layersRegistryAtom);
      for (const [layerId, layer] of Array.from(currentRegistry)) {
        if (layerId === id) {
          schedule((dispatch) => {
            dispatch(layer.enable());
          });
          break;
        }
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
