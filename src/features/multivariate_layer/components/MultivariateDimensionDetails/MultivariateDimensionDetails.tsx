import React from 'react';
import { Select } from '@konturio/ui-kit';
import { Rubber16 } from '@konturio/default-icons';
import { MCDALayerParameters } from '~features/mcda/components/MCDALayerEditor/MCDALayerParameters/MCDALayerParameters';
import { LayerActionIcon } from '~components/LayerActionIcon/LayerActionIcon';
import { i18n } from '~core/localization';
import s from './MultivariateDimensionDetails.module.css';
import type { MultivariateDimensionsLayers } from '../MultivariateAnalysisForm';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export function MultivariateDimensionDetails({
  dimensionsLayers,
  dimensionId,
  dimensionTitle,
  onLayerEdited,
  onLayerDeleted,
  onLayerDimensionChanged,
}: {
  dimensionsLayers: MultivariateDimensionsLayers;
  dimensionId: string;
  dimensionTitle: string;
  onLayerEdited: (editedLayer: MCDALayer, dimension: string) => void;
  onLayerDeleted: (deletedLayer: MCDALayer, dimension: string) => void;
  onLayerDimensionChanged: (
    layer: MCDALayer,
    oldDimension: string,
    newDimension: string,
  ) => void;
}) {
  return (
    <div className={s.dimension}>
      <div className={s.dimensionName}>{dimensionTitle}</div>
      {dimensionsLayers[dimensionId].map((mcdaLayer, index) => (
        <div key={`${dimensionId}-${index}-${mcdaLayer.name}`} className={s.layerRow}>
          <Select
            className={s.dimensionTypeSelect}
            type="inline"
            value={{ value: dimensionId, title: dimensionTitle }}
            onChange={(e) => {
              if (e.selectedItem?.value !== dimensionId) {
                onLayerDimensionChanged(
                  mcdaLayer,
                  dimensionId,
                  (e.selectedItem?.value as string) ?? '',
                );
              }
            }}
            items={[
              { value: 'score', title: i18n.t('multivariate.score') },
              { value: 'compare', title: i18n.t('multivariate.compare') },
            ]}
          >
            {dimensionTitle}
          </Select>
          <div>
            <MCDALayerParameters
              layer={mcdaLayer}
              onLayerEdited={(editedLayer) => {
                onLayerEdited(editedLayer, dimensionId);
              }}
            />
          </div>
          <div className={s.deleteButton}>
            <LayerActionIcon
              onClick={() => {
                onLayerDeleted(mcdaLayer, dimensionId);
              }}
              hint={i18n.t('layer_actions.tooltips.erase')}
            >
              <Rubber16 />
            </LayerActionIcon>
          </div>
        </div>
      ))}
    </div>
  );
}
