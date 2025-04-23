import { createAtom } from '~utils/atoms';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { layersSourcesAtom } from '~core/logical_layers/atoms/layersSources';
import { BivariateRenderer } from '~core/logical_layers/renderers/BivariateRenderer/BivariateRenderer';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { layersEditorsAtom } from '~core/logical_layers/atoms/layersEditors';
import { layersLegendsAtom } from '~core/logical_layers/atoms/layersLegends';
import { i18n } from '~core/localization';
import { generateMCDALegendColors } from '~utils/mcda/mcdaLegendsUtils';
import { DEFAULT_BIVARIATE_TILE_SOURCE } from '~core/bivariate';
import { MCDALayerEditor } from '../components/MCDALayerEditor';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Action } from '@reatom/core-v2';

export const mcdaLayerAtom = createAtom(
  {
    createMCDALayer: (json: MCDAConfig) => json,
    enableMCDALayer: (layerId: string) => layerId,
    disableMCDALayer: () => null,
  },
  ({ onAction, schedule, getUnlistedState }) => {
    onAction('createMCDALayer', (json) => {
      const id = json.id;
      const name = json.name;
      let legendColors: string[] | undefined;
      if (json.colors.type === 'sentiments') {
        legendColors = generateMCDALegendColors(json.colors);
      }

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
            source: DEFAULT_BIVARIATE_TILE_SOURCE,
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
