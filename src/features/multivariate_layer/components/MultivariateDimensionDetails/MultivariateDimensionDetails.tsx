import { Select } from '@konturio/ui-kit';
import { MCDALayerParameters } from '~features/mcda/components/MCDALayerEditor/MCDALayerParameters/MCDALayerParameters';
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
  { value: 'opacity', title: i18n.t('multivariate.hide_area') },
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
              if (e.selectedItem?.value && e.selectedItem?.value !== dimensionKey) {
                onLayerDimensionChanged(
                  mcdaLayer,
                  dimensionKey,
                  e.selectedItem.value as string,
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
              onDeletePressed={() => {
                onLayerDeleted(mcdaLayer, dimensionKey);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
