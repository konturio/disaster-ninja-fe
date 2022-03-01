import { useMemo } from 'react';
import { Legend as BiLegend, Text } from '@k2-packages/ui-kit';
import { invertClusters } from '@k2-packages/bivariate-tools';
import { Tooltip } from '~components/Tooltip/Tooltip';
import s from './BivariateLegend.module.css';
import clsx from 'clsx';
import { BivariateLegend as BivariateLegendType } from '~core/logical_layers/types/legends';
import { LayerMeta } from '~core/logical_layers/types/meta';
import { LayerLegend } from '~core/logical_layers/types/legends';

type BivariateLegendProps = {
  meta: LayerMeta | null;
  legend: LayerLegend | null;
  name: string;
  controls?: JSX.Element[];
  showDescription?: boolean;
  isHidden: boolean;
};

export function BivariateLegend({
  meta,
  legend,
  name,
  controls,
  showDescription = true,
  isHidden = false,
}: BivariateLegendProps) {
  const tipText = useMemo(() => {
    return meta
      ? [meta.description, meta.copyrights].flat().filter(Boolean).join('\n')
      : null;
  }, [meta]);

  const axis = useMemo(() => {
    if (!legend) return null;
    const axis = (legend as BivariateLegendType).axis;
    if (!axis) return null;
    // fallback axis description for bivariate layers
    if (!axis.x.label)
      axis.x.label = `${axis.x.quotient[0]} to ${axis.x.quotient[1]}`;
    if (!axis.y.label)
      axis.y.label = `${axis.y.quotient[0]} to ${axis.y.quotient[1]}`;
    return axis;
  }, [legend]);

  if (!legend) return null;
  if (!axis) return null;

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
        // @ts-ignore
        axis={axis}
      />
    </div>
  );
}
