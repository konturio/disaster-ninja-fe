import { Select } from '@konturio/ui-kit';
import { MCDALayerParameters } from '~features/mcda/components/MCDALayerEditor/MCDALayerParameters/MCDALayerParameters';
import { i18n } from '~core/localization';
import s from './MultivariateDimensionDetails.module.css';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type {
  MVAFormDimensionKey,
  MVAFormDimensions,
} from '../MultivariateAnalysisForm/MultivariateAnalysisForm';

const dimensionSelectItems: { value: MVAFormDimensionKey; title: string }[] = [
  { value: 'score', title: i18n.t('multivariate.score') },
  { value: 'compare', title: i18n.t('multivariate.compare') },
  { value: 'opacity', title: i18n.t('multivariate.hide_area') },
  { value: 'text', title: i18n.t('multivariate.labels') },
  { value: 'extrusion', title: i18n.t('multivariate.3d') },
];

export function MultivariateDimensionDetails({
  dimensionsLayers,
  dimensionKey,
  dimensionTitle,
  onLayerEdited,
  onLayerDeleted,
  onLayerDimensionChanged,
  topControls,
}: {
  dimensionsLayers: MVAFormDimensions;
  dimensionKey: MVAFormDimensionKey;
  dimensionTitle: string;
  onLayerEdited: (
    layerIndex: number,
    dimension: string,
    editedLayerConfig: MCDALayer,
  ) => void;
  onLayerDeleted: (layerIndex: number, dimension: string) => void;
  onLayerDimensionChanged: (
    layerIndex: number,
    oldDimension: string,
    newDimension: string,
  ) => void;
  topControls?: JSX.Element;
}) {
  return (
    <div className={s.dimension}>
      <div className={s.dimensionName}>{dimensionTitle}</div>
      {topControls && <div className={s.topControls}>{topControls}</div>}
      {dimensionsLayers[dimensionKey].map((mcdaLayer, index) => (
        <div key={`${dimensionKey}-${index}-${mcdaLayer.name}`} className={s.layerRow}>
          <Select
            className={s.dimensionTypeSelect}
            type="inline"
            value={{ value: dimensionKey, title: dimensionTitle }}
            onChange={(e) => {
              if (e.selectedItem?.value && e.selectedItem?.value !== dimensionKey) {
                onLayerDimensionChanged(
                  index,
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
                onLayerEdited(index, dimensionKey, editedLayer);
              }}
              onDeletePressed={() => {
                onLayerDeleted(index, dimensionKey);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
