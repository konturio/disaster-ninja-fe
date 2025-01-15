import {
  filterSetup as mcdaFilterSetup,
  linearNormalization,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/mcdaStyle';
import {
  addVariable,
  classResolver,
  colorResolver,
  getVariable,
} from '../bivariate/bivariate_style/styleGen';
import { colorsMap } from '../bivariate/bivariate_style';
import { DEFAULT_MULTIBIVARIATE_COLORS, DEFAULT_MULTIBIVARIATE_STEPS } from './constants';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';
import type { ColorTheme } from '~core/types';
import type { OverlayColor, Step } from '../bivariate/types/stat.types';
import type { MCDALayerStyle } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { ExpressionSpecification, FillLayerSpecification } from 'maplibre-gl';

export interface MultivaritateBivariateGeneratorProps {
  base: MCDALayerStyle['config'];
  annex: MCDALayerStyle['config'];
  colors: OverlayColor[];
  id?: string;
  sourceLayer?: string;
}

export function generateBivariateColorsAndStyleForMultivariateLayer(
  config: MultivariateLayerConfig,
  sourceLayer: string,
): [ColorTheme, FillLayerSpecification] {
  const xAxis = config.base;
  const yAxis = config.annex;
  if (!xAxis || !yAxis) {
    console.error('Both base and annex are required for bivariate style', config);
    throw Error('Both base and annex are required for bivariate style');
  }
  const colors =
    config.colors?.type === 'bivariate'
      ? config.colors?.colors
      : DEFAULT_MULTIBIVARIATE_COLORS;
  if (!colors) {
    console.error('Proper color theme not found. Using default colors.');
  }

  const bivariateStyle = createBivariateMultivariateStyle({
    base: xAxis.config,
    annex: yAxis.config,
    colors,
    sourceLayer,
  });

  return [colors, bivariateStyle];
}

function setupColorClasses(
  baseValue: ExpressionSpecification,
  annexValue: ExpressionSpecification,
  baseSteps: Step[],
  annexSteps: Step[],
  colors: Record<string, string>,
): ExpressionSpecification {
  return addVariable(
    'baseValue',
    baseValue,
    addVariable(
      'annexValue',
      annexValue,
      addVariable(
        'class',
        classResolver(
          {
            propName: getVariable('baseValue'),
            borders: baseSteps.reduce<number[]>(
              (acc, { value }) => (acc.push(value), acc),
              [],
            ),
          },
          {
            propName: getVariable('annexValue'),
            borders: annexSteps.reduce<number[]>(
              (acc, { value }) => (acc.push(value), acc),
              [],
            ),
          },
        ),
        colorResolver('class', colors, 'transparent'),
      ),
    ),
  );
}

function createBivariateMultivariateStyle({
  base,
  annex,
  colors,
  sourceLayer,
  id = 'multivariate-bivariate',
}: MultivaritateBivariateGeneratorProps): FillLayerSpecification {
  const baseValueExpression = linearNormalization(base.layers);
  const annesValueExpression = linearNormalization(annex.layers);
  const filter = mcdaFilterSetup([...base.layers, ...annex.layers]);

  const style: FillLayerSpecification = {
    id,
    type: 'fill' as const,
    layout: {},
    filter,
    paint: {
      'fill-color': setupColorClasses(
        baseValueExpression,
        annesValueExpression,
        DEFAULT_MULTIBIVARIATE_STEPS,
        DEFAULT_MULTIBIVARIATE_STEPS,
        colorsMap(colors),
      ),
      'fill-opacity': 1,
      'fill-antialias': false,
    },
    source: id + '_source', // this id is replaced inside the Renderer
  };

  if (sourceLayer) {
    style['source-layer'] = sourceLayer;
  }

  return style;
}
