import { useMemo } from 'react';
import { LogicalLayer } from '~core/logical_layers/createLogicalLayerAtom';
import { Legend as BiLegend, Text } from '@k2-packages/ui-kit';
import { invertClusters } from '@k2-packages/bivariate-tools';
import { Tooltip } from '~components/Tooltip/Tooltip';
import s from './BivariateLegend.module.css';
import cn from 'clsx';

type BivariateLegendProps = {
  layer: LogicalLayer;
  controls?: JSX.Element[];
  showDescrption?: boolean;
  isHidden?: boolean
};

export function BivariateLegend({ layer, controls, showDescrption = true, isHidden }: BivariateLegendProps) {
  const tipText = useMemo(() => {
    if (!layer.legend || layer.legend.type === 'simple') return '';
    let message = '';
    if ('copyrights' in layer.legend && layer.legend.copyrights && layer.legend.copyrights.length) {
      layer.legend.copyrights.forEach((copyright, index) => {
        if (index) {
          message += '\n';
        }
        message += copyright;
      });
    }
    return message;
  }, [layer.legend]);

  return layer.legend && layer.legend.type !== 'simple' && layer.name ?
    <div
      className={cn(
        s.bivariateLegend,
        {
          [s.hidden]: isHidden,
        },
      )}>
      {showDescrption && <div className={s.headline}>
        <Text type="long-m">
          <span className={s.layerName}>{layer.name}</span>
        </Text>
        <div className={s.controlsBar}>{controls}
          {tipText &&
            <Tooltip className={s.tooltip} tipText={tipText} />
          }
        </div>
      </div>}

      <BiLegend
        showAxisLabels
        size={3}
        cells={invertClusters(layer.legend.steps, 'label')}
        axis={'axis' in layer.legend && layer.legend.axis as any}
      />

      {showDescrption && <Text type="caption">
        {layer.description || ('description' in layer.legend && layer.legend.description)}
      </Text>}
    </div> : null
}
