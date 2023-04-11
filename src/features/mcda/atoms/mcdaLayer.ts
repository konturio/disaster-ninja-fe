import { createAtom } from '~utils/atoms';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import {
  createMCDASource,
  createMCDAStyle,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/mcdaStyle';
import { MCDARenderer } from '../../../core/logical_layers/renderers/MCDARenderer';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export const mcdaLayerAtom = createAtom(
  {
    calcMCDA: (json: MCDAConfig) => json,
    enableMCDALayer: (layerId: string) => layerId,
    disableMCDALayer: () => null,
  },
  ({ onAction, schedule, getUnlistedState, create }) => {
    onAction('calcMCDA', (json) => {
      const id = json.id;
      const layerStyle = createMCDAStyle(json);
      const source = createMCDASource(id, layerStyle.source!);

      const [updateActions, cleanUpActions] = createUpdateLayerActions([
        {
          id,
          legend: undefined,
          meta: undefined,
          source,
        },
      ]);

      const currentSettings = getUnlistedState(layersSettingsAtom);
      if (!currentSettings.has(id)) {
        updateActions.push(
          ...createUpdateLayerActions([
            {
              id,
              settings: {
                id,
                name: id,
                category: 'overlay' as const,
                group: 'bivariate',
                ownedByUser: true,
              },
            },
          ]).flat(),
        );
      }

      // Register and Enable
      const currentRegistry = getUnlistedState(layersRegistryAtom);
      if (!currentRegistry.has(id)) {
        updateActions.push(
          layersRegistryAtom.register({
            id,
            renderer: new MCDARenderer({ id, layerStyle, json }),
            cleanUpActions,
          }),
          create('enableMCDALayer', id),
        );
      }

      if (updateActions.length) {
        schedule((dispatch, ctx: { mcdaLayerAtomId?: string } = {}) => {
          dispatch(updateActions);
          ctx.mcdaLayerAtomId = id;
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
