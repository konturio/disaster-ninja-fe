import { Legend as BiLegend, MCDALegend } from '@konturio/ui-kit';
import { generateMCDALegendColors } from '~utils/mcda/mcdaLegendsUtils';
import { BIVARIATE_LEGEND_SIZE } from '~components/BivariateLegend/const';
import { DEFAULT_MULTIBIVARIATE_STEPS } from '~utils/multivariate/constants';
import { invertClusters, type Step } from '~utils/bivariate';
import { CornerTooltipWrapper } from '~components/BivariateLegend/CornerTooltipWrapper';
import { i18n } from '~core/localization';
import { isNumber } from '~utils/common';
import { DEFAULT_BASE_DIRECTION, DEFAULT_SCORE_DIRECTION } from './constants';
import s from './MultivariateLegend.module.css';
import type { Direction } from '~utils/bivariate';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { ColorTheme } from '~core/types';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';
import type {
  MCDAConfig,
  MCDALayer,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Cell } from '@konturio/ui-kit/tslib/Legend/types';

export type MultivariateLegendProps = {
  config: MultivariateLayerConfig;
};

type MultiBivariateLegendAxisProp = {
  label: string;
  steps: {
    label?: string;
    value: number;
  }[];
  quality?: number;
  quotient: [string, string];
};

function DimensionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className={s.dimensionName}>{title}</div>
      {children}
    </div>
  );
}

function createMCDALegend(mcdaConfig: MCDAConfig, title: string): JSX.Element {
  let legendColors: string[] | undefined;
  if (mcdaConfig.colors.type === 'sentiments') {
    legendColors = generateMCDALegendColors(mcdaConfig.colors);
  }
  return (
    <DimensionBlock title={title}>
      {printMCDAAxes(mcdaConfig.layers)}
      <MCDALegend steps={5} colors={legendColors} />
    </DimensionBlock>
  );
}

function getCornerHintsForDimension(
  dimension: MCDAConfig,
  defaultDirection: Direction,
): {
  label: string;
  direction: Direction;
} {
  const label = dimension.name;
  let direction = defaultDirection;
  const mcdaAxes = dimension.layers;
  if (mcdaAxes.length === 1 && mcdaAxes[0].indicators.length > 0) {
    direction = mcdaAxes[0].indicators[0].direction;
  }
  return { label, direction };
}

function createBivariateLegend(
  score: MCDAConfig,
  base: MCDAConfig,
  scoreSteps: Step[],
  baseSteps: Step[],
  colors: ColorTheme,
  title: string,
) {
  const xAxis: MultiBivariateLegendAxisProp = {
    label: base.name,
    steps: baseSteps,
    quotient: ['', ''],
  };
  const yAxis: MultiBivariateLegendAxisProp = {
    label: score.name,
    steps: scoreSteps,
    quotient: ['', ''],
  };
  const cells = invertClusters(
    colors.map(({ id, color, isFallbackColor }) => ({
      label: id,
      color,
      isFallbackColor,
    })),
    'label',
  ) as Cell[];

  const hints: LayerMeta['hints'] = {
    x: getCornerHintsForDimension(score, DEFAULT_SCORE_DIRECTION),
    y: getCornerHintsForDimension(base, DEFAULT_BASE_DIRECTION),
  };
  return (
    <DimensionBlock title={title}>
      <CornerTooltipWrapper hints={hints}>
        <BiLegend
          cells={cells}
          size={BIVARIATE_LEGEND_SIZE}
          axis={{ x: xAxis, y: yAxis }}
          showAxisLabels
        />
      </CornerTooltipWrapper>
    </DimensionBlock>
  );
}

function printMCDAAxes(axes: MCDALayer[]) {
  return (
    <div>
      {axes.map((layer, index) => (
        <div key={`${layer.id}-${index}`} className={s.parameter}>
          - {layer.name}
        </div>
      ))}
    </div>
  );
}

function createOpacityLegend(config: MultivariateLayerConfig) {
  let opacityLegend;
  if (typeof config.opacity === 'object' && config.opacity?.config?.layers.length) {
    opacityLegend = printMCDAAxes(config.opacity.config.layers);
  } else if (isNumber(config.opacity)) {
    opacityLegend = `${i18n.t('multivariate.static_opacity')}: ${config.opacity}`;
  }
  if (opacityLegend) {
    return (
      <DimensionBlock title={i18n.t('multivariate.hide_area')}>
        {opacityLegend}
      </DimensionBlock>
    );
  }
}

function createExtrusionLegend(config: MultivariateLayerConfig) {
  if (config.extrusion?.height?.config?.layers.length) {
    return (
      <DimensionBlock title={i18n.t('multivariate.3d')}>
        {printMCDAAxes(config.extrusion.height.config.layers)}
      </DimensionBlock>
    );
  }
}

function createTextLegend(config: MultivariateLayerConfig) {
  if (config.text) {
    return (
      <DimensionBlock title={i18n.t('multivariate.labels')}>
        {config.text?.mcdaValue?.config?.layers &&
          printMCDAAxes(config.text.mcdaValue.config.layers)}
      </DimensionBlock>
    );
  }
}

function createFillLegend(config: MultivariateLayerConfig) {
  if (config.score && config.base && config.colors?.type === 'bivariate') {
    return createBivariateLegend(
      config.score.config,
      config.base.config,
      config.stepOverrides?.scoreSteps ?? DEFAULT_MULTIBIVARIATE_STEPS,
      config.stepOverrides?.baseSteps ?? DEFAULT_MULTIBIVARIATE_STEPS,
      config.colors.colors,
      i18n.t('multivariate.score_and_compare'),
    );
  } else if (config.score) {
    return createMCDALegend(config.score.config, i18n.t('multivariate.score'));
  } else if (config.base) {
    return createMCDALegend(config.base.config, i18n.t('multivariate.compare'));
  }
}

export function MultivariateLegend({ config }: MultivariateLegendProps) {
  const fillLegend = createFillLegend(config);
  const opacityLegend = createOpacityLegend(config);
  const extrusionLegend = createExtrusionLegend(config);
  const textLegend = createTextLegend(config);

  return (
    <div className={s.dimensionsContainer}>
      {fillLegend}
      {opacityLegend}
      {extrusionLegend}
      {textLegend}
    </div>
  );
}
