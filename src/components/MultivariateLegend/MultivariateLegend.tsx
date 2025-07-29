import { Legend as BiLegend, MCDALegend, Text } from '@konturio/ui-kit';
import { Letter } from '@konturio/default-icons';
import clsx from 'clsx';
import { generateMCDALegendColors } from '~utils/mcda/mcdaLegendsUtils';
import { BIVARIATE_LEGEND_SIZE } from '~components/BivariateLegend/const';
import { DEFAULT_MULTIBIVARIATE_STEPS } from '~utils/multivariate/constants';
import { invertClusters, type Step } from '~utils/bivariate';
import { CornerTooltipWrapper } from '~components/BivariateLegend/CornerTooltipWrapper';
import { i18n } from '~core/localization';
import { isNumber } from '~utils/common';
import OpacityStepsLegend from '~components/MultivariateLegend/OpacityStepsLegend';
import ExtrusionStepsLegend from './ExtrusionStepsLegend';
import { DEFAULT_BASE_DIRECTION, DEFAULT_SCORE_DIRECTION } from './constants';
import s from './MultivariateLegend.module.css';
import { MultivariateLegendStep } from './MultivariateLegendStep';
import { getMCDALayersDirectionsForLegend } from './helpers/getMCDALayersDirectionsForLegend';
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

function DimensionStack({
  title,
  children,
  grayscale,
}: {
  title: string;
  children: React.ReactNode;
  grayscale?: boolean;
}) {
  return (
    <div>
      <div className={s.dimensionName}>{title}</div>
      <div className={clsx({ [s.grayscale]: grayscale })}>{children}</div>
    </div>
  );
}

function createMCDALegend(mcdaConfig: MCDAConfig, title: string): JSX.Element {
  let legendColors: string[] | undefined;
  if (mcdaConfig.colors.type === 'sentiments') {
    legendColors = generateMCDALegendColors(mcdaConfig.colors);
  }
  return (
    <DimensionStack title={title}>
      <Text type="caption">
        {mcdaConfig.layers?.map((layer) => layer.name).join(', ')}
      </Text>
      <div className={s.mcdaLegend}>
        <MCDALegend
          steps={5}
          colors={legendColors}
          subtitle={i18n.t('multivariate.mcda_legend_subtitle')}
          fromValue={i18n.t('mcda.bad')}
          toValue={i18n.t('mcda.good')}
        />
      </div>
    </DimensionStack>
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
    <DimensionStack title={title}>
      <CornerTooltipWrapper hints={hints}>
        <BiLegend
          cells={cells}
          size={BIVARIATE_LEGEND_SIZE}
          axis={{ x: xAxis, y: yAxis }}
          showAxisLabels
        />
      </CornerTooltipWrapper>
    </DimensionStack>
  );
}

function createOpacityLegend(config: MultivariateLayerConfig, hasColors: boolean) {
  let opacityLegend;
  if (typeof config.opacity === 'object' && config.opacity?.config?.layers.length) {
    opacityLegend = (
      <OpacityStepsLegend {...getMCDALayersDirectionsForLegend(config.opacity?.config)} />
    );
  } else if (isNumber(config.opacity)) {
    opacityLegend = (
      <Text type="caption">
        {`${i18n.t('multivariate.static_opacity')}: ${config.opacity}`}
      </Text>
    );
  }
  if (opacityLegend) {
    return (
      <DimensionStack title={i18n.t('multivariate.hide_area')} grayscale={!hasColors}>
        {opacityLegend}
      </DimensionStack>
    );
  }
}

function createExtrusionLegend(config: MultivariateLayerConfig, hasColors: boolean) {
  if (config.extrusion?.height?.config?.layers.length) {
    return (
      <DimensionStack title={i18n.t('multivariate.3d')} grayscale={!hasColors}>
        <ExtrusionStepsLegend
          {...getMCDALayersDirectionsForLegend(config.extrusion.height.config)}
        />
      </DimensionStack>
    );
  }
}

function createTextLegend(config: MultivariateLayerConfig) {
  if (config.text?.mcdaValue?.config?.layers.length) {
    const label = config.text.mcdaValue?.config?.layers
      .map((layer) => layer.name)
      .join(', ');
    return (
      <DimensionStack title={i18n.t('multivariate.labels')}>
        <MultivariateLegendStep
          textLines={[label]}
          icon={<Letter className={s.textIcon} />}
          lineKey="labels"
        />
      </DimensionStack>
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
  } else if (config.score?.config.layers?.length) {
    return createMCDALegend(config.score.config, i18n.t('multivariate.score'));
  } else if (config.base?.config.layers?.length) {
    return createMCDALegend(config.base.config, i18n.t('multivariate.compare'));
  }
}

export function MultivariateLegend({ config }: MultivariateLegendProps) {
  const fillLegend = createFillLegend(config);
  const hasColors = !!fillLegend;
  const opacityLegend = createOpacityLegend(config, hasColors);
  const extrusionLegend = createExtrusionLegend(config, hasColors);
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
