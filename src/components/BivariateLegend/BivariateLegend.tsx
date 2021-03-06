import { useMemo } from 'react';
import { Legend as BiLegend, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { invertClusters } from '~utils/bivariate';
import { Tooltip } from '~components/Tooltip';
import s from './BivariateLegend.module.css';
import { CornerTooltipWrapper } from './CornerTooltipWrapper';
import { BIVARIATE_LEGEND_SIZE } from './const';
import type { BivariateLegend as BivariateLegendType } from '~core/logical_layers/types/legends';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { LayerLegend } from '~core/logical_layers/types/legends';

export type BivariateLegendProps = {
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
    if (!axis.x.label || !axis.y.label) {
      return {
        x: {
          ...axis.x,
          label:
            axis.x.label || `${axis.x.quotient[0]} to ${axis.x.quotient[1]}`,
        },
        y: {
          ...axis.y,
          label:
            axis.y.label || `${axis.y.quotient[0]} to ${axis.y.quotient[1]}`,
        },
      };
    }

    return {
      x: axis.y,
      y: axis.x,
    };
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
      <CornerTooltipWrapper meta={meta}>
        <BiLegend
          showAxisLabels
          size={BIVARIATE_LEGEND_SIZE}
          cells={invertClusters(legend.steps, 'label')}
          // @ts-ignore
          axis={axis}
        />
      </CornerTooltipWrapper>
    </div>
  );
}
