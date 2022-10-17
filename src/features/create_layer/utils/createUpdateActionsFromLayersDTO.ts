import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import type { Action } from '@reatom/core';
import type { EditableLayers } from '../types';

type LayerId = string;

export function createUpdateActionsFromLayersDTO(
  layers: [LayerId, EditableLayers][],
): Action[][] {
  const updates = layers.map(([layerId, layer]) => ({
    id: layerId,
    meta: {
      description: layer.description,
      copyrights: layer.copyrights,
    },
    settings: {
      id: layerId,
      name: layer.name,
      category: layer.category,
      group: layer.group,
      boundaryRequiredForRetrieval: layer.boundaryRequiredForRetrieval ?? false,
      ownedByUser: layer.ownedByUser,
    },
  }));

  return createUpdateLayerActions(updates);
}
