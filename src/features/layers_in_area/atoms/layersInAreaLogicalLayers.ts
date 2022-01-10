import type { Action } from '@reatom/core';
import { createBindAtom } from '~utils/atoms';
import { logicalLayersRegistryAtom } from '~core/logical_layers/atoms/logicalLayersRegistry';
import {
  createLogicalLayerAtom,
  LogicalLayerAtom,
} from '~core/logical_layers/createLogicalLayerAtom';
import { layersInAreaResourceAtom, paramsAtom } from './layersInArea';
import { GenericLayer } from '../layers/GenericLayer';
import { createBivariateLayerFromPreset } from '../layers/BivariateLayer';
import { LayerInArea } from '../types';

type LayersInAreaAtomProps = {
  loading: boolean;
  data?: LayerInArea[] | null;
  error: any;
};

const layersInAreaData = createBindAtom(
  {
    updateData: (state) => state,
  },
  ({ onAction }, state = null) => {
    onAction('updateData', (update) => (state = update));
    return state;
  },
);

export const layersInAreaLogicalLayersAtom = createBindAtom(
  {
    layersInAreaResourceAtom,
  },
  ({ onChange, schedule, getUnlistedState }) => {
    onChange(
      'layersInAreaResourceAtom',
      (
        { loading, data: newLayers, error }: LayersInAreaAtomProps,
        prevData: LayersInAreaAtomProps | null,
      ) => {
        if (loading) return null;
        const oldLayers: LayerInArea[] = prevData?.data || [];
        const actions: Action[] = [];

        /* Find what added */
        const oldLayersIds = new Set(oldLayers.map((l) => l.id));
        const mustBeRegistered = newLayers
          ? newLayers.filter((l) => !oldLayersIds.has(l.id))
          : [];
        const logicalLayersAtoms = mustBeRegistered.reduce(
          (acc: LogicalLayerAtom[], layer) => {
            if (layer.legend?.type === 'bivariate') {
              acc.push(
                createLogicalLayerAtom(createBivariateLayerFromPreset(layer)),
              );
            } else {
              // TODO: Check layer flags and subscribe only to data that required
              // Wait unit #8421 was merged
              acc.push(
                createLogicalLayerAtom(
                  new GenericLayer(layer),
                  layersInAreaData,
                ),
              );
            }
            return acc;
          },
          [],
        );
        if (logicalLayersAtoms.length > 0) {
          actions.push(
            logicalLayersRegistryAtom.registerLayer(logicalLayersAtoms),
          );
        }

        /* Find what removed */
        const newLayersIds = new Set(
          newLayers ? newLayers.map((l) => l.id) : [],
        );
        const mustBeUnregistered = oldLayers.filter(
          (layer) => !newLayersIds.has(layer.id),
        );

        mustBeUnregistered.forEach((config) => {
          const action = logicalLayersRegistryAtom.unregisterLayer(config.id);
          actions.push(action);
        });

        const paramsData = getUnlistedState(paramsAtom);

        /* Batch actions into one transaction */
        if (actions.length > 0) {
          schedule((dispatch) => {
            dispatch(actions);
            setTimeout(() => {
              dispatch(layersInAreaData.updateData(paramsData.focusedGeometry));
            }, 1000);
          });
        }
      },
    );
  },
  'layersInAreaLogicalLayers',
);
