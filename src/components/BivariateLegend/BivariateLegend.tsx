import { useMemo } from 'react';
import { LogicalLayer } from '~core/logical_layers/createLogicalLayerAtom';
import { Legend as BiLegend, Text } from '@k2-packages/ui-kit';
import { invertClusters } from '@k2-packages/bivariate-tools';
import { Tooltip } from '~components/Tooltip/Tooltip';
import s from './BivariateLegend.module.css';
import clsx from 'clsx';

type BivariateLegendProps = {
  layer: LogicalLayer;
  controls?: JSX.Element[];
  showDescription?: boolean;
  isHidden: boolean;
};

export function BivariateLegend({
  layer,
  controls,
  showDescription = true,
  isHidden = false,
}: BivariateLegendProps) {
  const { legend, name } = layer;

  const tipText = useMemo(() => {
    let message = '';
    if (!layer.legend) return message;

    if ('description' in layer.legend) {
      message = layer.legend.description + '\n';
    }
    if (
      'copyrights' in layer.legend &&
      layer.legend.copyrights &&
      layer.legend.copyrights.length
    ) {
      layer.legend.copyrights.forEach((copyright, index) => {
        if (index) {
          message += '\n';
        }
        message += copyright;
      });
    }
    return message;
  }, [legend]);

  if (legend === undefined) return null;

  return (
    <div className={clsx(s.bivariateLegend, isHidden && s.hidden)}>
      {showDescription && (
        <div className={s.headline}>
          <Text type="long-m">
            <span className={s.layerName}>{name}</span>
          </Text>

          <div className={s.controlsBar}>
            {controls}
            {tipText && <Tooltip tipText={tipText} />}
          </div>
        </div>
      )}

      <BiLegend
        showAxisLabels
        size={3}
        cells={invertClusters(legend.steps, 'label')}
        axis={'axis' in legend && (legend.axis as any)}
      />
    </div>
  );
}
