import type { Action } from '@reatom/core';
import { createBindAtom } from '~utils/atoms';
import { logicalLayersRegistryAtom } from '~core/logical_layers/atoms/logicalLayersRegistry';
import {
  createLogicalLayerAtom,
  LogicalLayer,
} from '~core/logical_layers/createLogicalLayerAtom';
import { layersInAreaResourceAtom } from './layersInArea';
import { GenericLayer } from '../layers/GenericLayer';
import { focusedGeometryAtom } from '~core/shared_state';
import { LayerInArea } from '../types';

type LayersInAreaAtomProps = {
  loading: boolean;
  data?: LayerInArea[] | null;
  error: any;
};
export const layersInAreaLogicalLayersAtom = createBindAtom(
  {
    layersInAreaResourceAtom,
  },
  ({ onChange, schedule }) => {
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
        const logicalLayersAtoms = mustBeRegistered.map((layer) =>
          createLogicalLayerAtom(new GenericLayer(layer), focusedGeometryAtom),
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

        /* Batch actions into one transaction */
        if (actions.length > 0) {
          schedule((dispatch) => {
            dispatch(actions);
          });
        }
      },
    );
  },
  'layersInAreaLogicalLayers',
);
