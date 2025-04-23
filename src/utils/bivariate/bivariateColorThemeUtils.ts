import { Hsluv } from 'hsluv';
import { generateBivariateStyleForAxis } from '~utils/bivariate';
import { getMaxNumeratorZoomLevel } from '~utils/bivariate/getMaxZoomLevel';
import { FALLBACK_BIVARIATE_MAX_ZOOM } from '~core/logical_layers/renderers/BivariateRenderer/constants';
import { getDefaultBivariateTilesUrl } from '~core/bivariate/getDefaultBivariateTilesUrl';
import type { FilterSpecification } from 'maplibre-gl';
import type { CornerRange, Stat } from '~utils/bivariate';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { ColorTheme } from '~core/types';
import type { Axis, ColorCombination, Direction } from '~utils/bivariate';
import type { RGBAColor } from '~core/types/color';

type ColorTuple = [number, number, number];

export type BivariateLayerSource = {
  type: 'vector';
  tiles: string[];
  maxzoom: number;
  minzoom: number;
};

export interface BivariateLayerStyle {
  id: string;
  type: 'fill';
  source?: BivariateLayerSource;
  layout: unknown;
  filter: FilterSpecification;
  paint: {
    'fill-color': unknown[];
    'fill-opacity': number;
    'fill-antialias': boolean;
  };
  'source-layer'?: string;
}

function interpolate360(start: number, end: number): number {
  return start + (((((end - start) % 360) + 540) % 360) - 180) * 0.5;
}

function interpolateLinear(start: number, end: number): number {
  return (start + end) / 2;
}

function interpolateHsl(start: ColorTuple, end: ColorTuple): ColorTuple {
  return [
    interpolate360(start[0], end[0]),
    interpolateLinear(start[1], end[1]),
    interpolateLinear(start[2], end[2]),
  ];
}

function convertToRgbaWithOpacity(hexColor: string): string {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)) {
    let clr = hexColor.substring(1).split('');
    if (clr.length === 3) {
      clr = [clr[0], clr[0], clr[1], clr[1], clr[2], clr[2]];
    }
    const hexNum: number = parseInt(`0x${clr.join('')}`, 0);
    return `rgba(${[(hexNum >> 16) & 255, (hexNum >> 8) & 255, hexNum & 255].join(
      ',',
    )},0.5)`;
  }
  throw new Error('Bad Hex');
}

function findColors(
  colors: {
    fallback: string;
    combinations: ColorCombination[];
  },
  crn: [CornerRange[], CornerRange[]],
): { color: string; isFallbackColor?: boolean } {
  const corner1 = (Array.isArray(crn[0]) ? [...crn[0]] : [crn[0]]).sort();
  const corner2 = (Array.isArray(crn[1]) ? [...crn[1]] : [crn[1]]).sort();

  const mergedCorner = Array.from(new Set(corner1.concat(corner2)));

  const combination = colors.combinations.find(({ corner }) => {
    if (mergedCorner.length !== corner.length) return false;
    for (let i = 0; i < mergedCorner.length; i += 1) {
      if (mergedCorner[i] !== corner[i]) {
        return false;
      }
    }
    return true;
  });

  // need this line for testing purposes, uncomment it to simulate undefined color combinations
  // TODO: remove commented line after bivariate color editor work is finished
  //if (combination && Math.random() * 100 < 10) combination.color = '';

  return combination?.color
    ? { color: combination.color }
    : { color: colors.fallback, isFallbackColor: true };
}

export function generateColorThemeAndBivariateStyle(
  xNumerator: string,
  xDenominator: string,
  yNumerator: string,
  yDenominator: string,
  stats: Stat,
  sourceLayer: string,
): [ColorTheme, BivariateLayerStyle] | undefined {
  const { indicators, colors, axis } = stats;

  const xAxis = axis.find(
    (ax) => ax.quotient[0] === xNumerator && ax.quotient[1] === xDenominator,
  );
  const yAxis = axis.find(
    (ax) => ax.quotient[0] === yNumerator && ax.quotient[1] === yDenominator,
  );

  if (!xAxis || !yAxis) return;

  /* Color theme generation */
  const xAxisDirection = indicators.find((ind) => ind.name === xNumerator)?.direction;
  const yAxisDirection = indicators.find((ind) => ind.name === yNumerator)?.direction;

  if (!xAxisDirection || !yAxisDirection) return;

  // put colors in specific way because x and y axes are swapped here
  const colorTheme: ColorTheme = generateColorTheme(
    colors,
    xAxisDirection,
    yAxisDirection,
  );

  const maxZoom = getMaxNumeratorZoomLevel(
    [xAxis.quotients ?? [], yAxis.quotients ?? []],
    stats.meta.max_zoom || FALLBACK_BIVARIATE_MAX_ZOOM,
  );

  const bivariateStyle = generateBivariateStyle(
    xAxis,
    yAxis,
    colorTheme,
    maxZoom,
    sourceLayer,
  );

  return [colorTheme, bivariateStyle];
}

export const generateBivariateStyle = (
  xAxis: Axis,
  yAxis: Axis,
  colorTheme: ColorTheme,
  maxZoomLevel: number,
  sourceLayer: string,
) =>
  generateBivariateStyleForAxis({
    id: `${xAxis.quotient.join('&')}|${yAxis.quotient.join('&')}`,
    x: xAxis,
    y: yAxis,
    colors: colorTheme,
    sourceLayer,
    source: {
      type: 'vector',
      tiles: [getDefaultBivariateTilesUrl()],
      maxzoom: maxZoomLevel,
      minzoom: 0,
    },
  });

export const generateColorTheme = (
  colors: Stat['colors'],
  xAxisDirection: Direction,
  yAxisDirection: Direction,
): ColorTheme => {
  const conv = new Hsluv();

  const corner00 = findColors(colors, [xAxisDirection[0], yAxisDirection[0]]);
  const corner01 = findColors(colors, [xAxisDirection[0], yAxisDirection[1]]);
  const corner10 = findColors(colors, [xAxisDirection[1], yAxisDirection[0]]);
  const corner11 = findColors(colors, [xAxisDirection[1], yAxisDirection[1]]);

  const cornerHsl = [corner00, corner01, corner10, corner11].map((c) => {
    conv.hex = c.color;
    conv.hexToHsluv();
    return [conv.hsluv_h, conv.hsluv_s, conv.hsluv_l] as ColorTuple;
  });

  const midLeftHsl = interpolateHsl(cornerHsl[0b00], cornerHsl[0b01]);
  const midBottomHsl = interpolateHsl(cornerHsl[0b00], cornerHsl[0b10]);
  const midTopHsl = interpolateHsl(cornerHsl[0b01], cornerHsl[0b11]);
  const midRightHsl = interpolateHsl(cornerHsl[0b10], cornerHsl[0b11]);
  const midMidHsl = interpolateHsl(midBottomHsl, midTopHsl);

  // rgba colors for corresponding cells
  const [A2, B1, B2, B3, C2] = [
    midLeftHsl,
    midBottomHsl,
    midMidHsl,
    midTopHsl,
    midRightHsl,
  ].map(([h, s, l]) => {
    conv.hsluv_h = h;
    conv.hsluv_s = s;
    conv.hsluv_l = l;
    conv.hsluvToHex();
    return convertToRgbaWithOpacity(conv.hex);
  });

  // put colors in specific way because x and y axes are swapped here
  const colorTheme: ColorTheme = [
    {
      id: 'A1',
      color: convertToRgbaWithOpacity(corner00.color),
      isFallbackColor: corner00.isFallbackColor,
    },
    { id: 'A2', color: A2 },
    {
      id: 'A3',
      color: convertToRgbaWithOpacity(corner01.color),
      isFallbackColor: corner01.isFallbackColor,
    },
    { id: 'B1', color: B1 },
    { id: 'B2', color: B2 },
    { id: 'B3', color: B3 },
    {
      id: 'C1',
      color: convertToRgbaWithOpacity(corner10.color),
      isFallbackColor: corner10.isFallbackColor,
    },
    { id: 'C2', color: C2 },
    {
      id: 'C3',
      color: convertToRgbaWithOpacity(corner11.color),
      isFallbackColor: corner11.isFallbackColor,
    },
  ];

  return colorTheme;
};

export function generateLayerStyleFromBivariateLegend(
  bl: BivariateLegend,
  sourceLayer: string,
): BivariateLayerStyle {
  return generateBivariateStyleForAxis({
    id: `${bl.axis.x.quotient.join('&')}|${bl.axis.y.quotient.join('&')}`,
    x: bl.axis.x,
    y: bl.axis.y,
    colors: [...bl.steps]
      .sort((stp1, stp2) => (stp1.label > stp2.label ? 1 : -1))
      .map((stp) => ({ id: stp.label, color: stp.color })),
    sourceLayer,
  });
}

export function convertRGBtoObj(colorString: string): RGBAColor {
  const rgbKeys = ['r', 'g', 'b', 'a'] as const;
  const rgbObj: { [K in (typeof rgbKeys)[number]]?: number } = {};
  // rgba(number, number, number, number) => [number, number, number, number];
  const color = colorString.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

  rgbKeys.forEach((colorKey, colorIndex) => {
    rgbObj[colorKey] = parseFloat(color[colorIndex]) || 1;
  });

  return rgbObj as { [K in (typeof rgbKeys)[number]]: number };
}
