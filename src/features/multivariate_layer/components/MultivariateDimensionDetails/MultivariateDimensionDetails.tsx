import { Select } from '@konturio/ui-kit';
import { Trash16 } from '@konturio/default-icons';
import { MCDALayerParameters } from '~features/mcda/components/MCDALayerEditor/MCDALayerParameters/MCDALayerParameters';
import { LayerActionIcon } from '~components/LayerActionIcon/LayerActionIcon';
import { i18n } from '~core/localization';
import s from './MultivariateDimensionDetails.module.css';
import type {
  MVAFormDimensionKey,
  MVAFormDimensions,
} from '../MultivariateAnalysisForm/MultivariateAnalysisForm';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

const dimensionSelectItems: { value: MVAFormDimensionKey; title: string }[] = [
  { value: 'score', title: i18n.t('multivariate.score') },
  { value: 'compare', title: i18n.t('multivariate.compare') },
];

export function MultivariateDimensionDetails({
  dimensionsLayers,
  dimensionKey,
  dimensionTitle,
  onLayerEdited,
  onLayerDeleted,
  onLayerDimensionChanged,
}: {
  dimensionsLayers: MVAFormDimensions;
  dimensionKey: MVAFormDimensionKey;
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
      {dimensionsLayers[dimensionKey].map((mcdaLayer, index) => (
        <div key={`${dimensionKey}-${index}-${mcdaLayer.name}`} className={s.layerRow}>
          <Select
            className={s.dimensionTypeSelect}
            type="inline"
            value={{ value: dimensionKey, title: dimensionTitle }}
            onChange={(e) => {
              if (e.selectedItem?.value !== dimensionKey) {
                onLayerDimensionChanged(
                  mcdaLayer,
                  dimensionKey,
                  (e.selectedItem?.value as string) ?? '',
                );
              }
            }}
            items={dimensionSelectItems}
          >
            {dimensionTitle}
          </Select>
          <div className={s.layerEditor}>
            <MCDALayerParameters
              layer={mcdaLayer}
              onLayerEdited={(editedLayer) => {
                onLayerEdited(editedLayer, dimensionKey);
              }}
            />
          </div>
          <div className={s.deleteButton}>
            <LayerActionIcon
              onClick={() => {
                onLayerDeleted(mcdaLayer, dimensionKey);
              }}
              hint={i18n.t('layer_actions.tooltips.erase')}
            >
              <Trash16 />
            </LayerActionIcon>
          </div>
        </div>
      ))}
    </div>
  );
}
