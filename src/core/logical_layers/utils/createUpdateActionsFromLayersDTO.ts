import { createUpdateLayerActions } from './createUpdateActions';
import type { LayerSummaryDto } from '../types/source';
import type { Action } from '@reatom/core-v2';

type LayerId = string;

export function createUpdateActionsFromLayersDTO(
  layers: [LayerId, LayerSummaryDto][],
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
