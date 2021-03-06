import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
import type { Action } from '@reatom/core';
import type { LayerInArea } from '../types';

export function createUpdateActionsFromLayersDTO(
  layerId: string,
  layer: LayerInArea,
): Action[][] {
  return createUpdateLayerActions(layerId, {
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
  });
}
