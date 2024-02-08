import { useMemo } from 'react';
import { Legend as BiLegend } from '@konturio/ui-kit';
import clsx from 'clsx';
import { formatBivariateAxisLabel, invertClusters } from '~utils/bivariate';
import s from './BivariateLegend.module.css';
import { CornerTooltipWrapper } from './CornerTooltipWrapper';
import { BIVARIATE_LEGEND_SIZE } from './const';
import type { Axis } from '~utils/bivariate';
import type { BivariateLegend as BivariateLegendType } from '~core/logical_layers/types/legends';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import type { LegendProps } from '@konturio/ui-kit';

export type BivariateLegendProps = {
  meta?: LayerMeta | null;
  legend?: LayerLegend | null;
  name?: string;
  controls?: JSX.Element[];
  showDescription?: boolean;
  isHidden?: boolean;
  showSteps?: boolean;
  showArrowHeads?: boolean;
  renderXAxisLabel?: LegendProps<{
    x: Axis;
    y: Axis;
  }>['renderXAxisLabel'];
  renderYAxisLabel?: LegendProps<{
    x: Axis;
    y: Axis;
  }>['renderYAxisLabel'];
};

export function BivariateLegend({
  meta,
  legend,
  isHidden = false,
  showSteps = true,
  showArrowHeads = true,
  renderXAxisLabel,
  renderYAxisLabel,
}: BivariateLegendProps) {
  const axis = useMemo(() => {
    if (!legend) return null;

    const axis = (legend as BivariateLegendType).axis;
    if (!axis) return null;
    // fallback axis description for bivariate layers
    if (!axis.x.label || !axis.y.label) {
      return {
        y: {
          ...axis.x,
          label: axis.x.label || formatBivariateAxisLabel(axis.x.quotients),
        },
        x: {
          ...axis.y,
          label: axis.y.label || formatBivariateAxisLabel(axis.y.quotients),
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

  let hints: LayerMeta['hints'] = meta?.hints;
  if (legend.type === 'bivariate' && !hints) {
    hints = {
      y: {
        label: axis.x.label,
        direction: axis.x?.quotients?.[0]?.direction,
      },
      x: {
        label: axis.y.label,
        direction: axis.y?.quotients?.[0]?.direction,
      },
    };
  }

  return (
    <div className={clsx(s.bivariateLegend, isHidden && s.hidden)}>
      <CornerTooltipWrapper hints={hints}>
        <BiLegend
          showAxisLabels
          size={BIVARIATE_LEGEND_SIZE}
          cells={invertClusters(legend.steps, 'label')}
          axis={axis}
          showSteps={showSteps}
          showArrowHeads={showArrowHeads}
          renderXAxisLabel={renderXAxisLabel}
          renderYAxisLabel={renderYAxisLabel}
        />
      </CornerTooltipWrapper>
    </div>
  );
}
