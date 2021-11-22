import { useMemo } from 'react';
import { LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';
import { Legend as BiLegend, Text } from '@k2-packages/ui-kit';
import { invertClusters } from '@k2-packages/bivariate-tools';
import { Tooltip } from '~components/Tooltip/Tooltip';
import s from './BivariateLegend.module.css';

type BivariateLegendProps = {
  layer: LogicalLayer;
  extraIcons?: JSX.Element[];
};

export function BivariateLegend({ layer, extraIcons }: BivariateLegendProps) {
  if (!layer.legend || layer.legend.type === 'simple' || !layer.name)
    return null;

  const tipText = useMemo(() => {
    if (!layer.legend || layer.legend.type === 'simple') return '';
    let message = '';
    if (layer.legend.copyrights && layer.legend.copyrights.length) {
      layer.legend.copyrights.forEach((copyright, index) => {
        if (index) {
          message += '\n';
        }
        message += copyright;
      });
    }
    return message;
  }, [layer.legend]);

  return (
    <div className={s.bivariateLegend}>
      <div className={s.headline}>
        <Text type="long-m">
          <span className={s.layerName}>{layer.name}</span>
        </Text>
        <Tooltip className={s.tooltip} tipText={tipText} />
        {extraIcons && [...extraIcons]}
      </div>

      <BiLegend
        showAxisLabels
        size={3}
        cells={invertClusters(layer.legend.steps, 'label')}
        axis={layer.legend.axis as any}
      />

      <Text type="caption">
        {layer.description || layer.legend.description}
      </Text>
    </div>
  );
}
