import { hexToHsluv, hsluvToHex } from 'hsluv';
import { generateBivariateStyleForAxis } from '~utils/bivariate';
import config from '~core/app_config';
import type { ColorTuple } from 'hsluv';
import type { CornerRange, Stat } from '~utils/bivariate';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { ColorTheme } from '~core/types';
import type { ColorCombination } from '~utils/bivariate/types/stat.types';

type BivariateLayerSource = {
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
  filter: unknown[];
  paint: {
    'fill-color': unknown[];
    'fill-opacity': number;
    'fill-antialias': boolean;
  };
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

function resolveUrl(url: string) {
  const isRelative = url.startsWith('/');
  return isRelative ? `${window.location.origin}${url}` : url;
}

function convertToRgbaWithOpacity(hexColor: string): string {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexColor)) {
    let clr = hexColor.substring(1).split('');
    if (clr.length === 3) {
      clr = [clr[0], clr[0], clr[1], clr[1], clr[2], clr[2]];
    }
    const hexNum: number = parseInt(`0x${clr.join('')}`, 0);
    return `rgba(${[
      (hexNum >> 16) & 255,
      (hexNum >> 8) & 255,
      hexNum & 255,
    ].join(',')},0.5)`;
  }
  throw new Error('Bad Hex');
}

function findColors(
  colors: {
    fallback: string;
    combinations: ColorCombination[];
  },
  crn: [CornerRange[], CornerRange[]],
): string {
  const corner1 = (Array.isArray(crn[0]) ? crn[0] : [crn[0]]).sort();
  const corner2 = (Array.isArray(crn[1]) ? crn[1] : [crn[1]]).sort();

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

  return combination?.color || colors.fallback;
}

export function generateColorThemeAndBivariateStyle(
  xNumerator: string,
  xDenominator: string,
  yNumerator: string,
  yDenominator: string,
  stats: Stat,
) {
  const { indicators, colors, axis } = stats;

  const xAxis = axis.find(
    (ax) => ax.quotient[0] === xNumerator && ax.quotient[1] === xDenominator,
  );
  const yAxis = axis.find(
    (ax) => ax.quotient[0] === yNumerator && ax.quotient[1] === yDenominator,
  );

  if (!xAxis || !yAxis) return;

  /* Color theme generation */
  const xAxisDirection = indicators.find(
    (ind) => ind.name === xNumerator,
  )?.direction;
  const yAxisDirection = indicators.find(
    (ind) => ind.name === yNumerator,
  )?.direction;

  if (!xAxisDirection || !yAxisDirection) return;

  const corner00 = findColors(colors, [xAxisDirection[0], yAxisDirection[0]]);
  const corner10 = findColors(colors, [xAxisDirection[1], yAxisDirection[0]]);
  const corner01 = findColors(colors, [xAxisDirection[0], yAxisDirection[1]]);
  const corner11 = findColors(colors, [xAxisDirection[1], yAxisDirection[1]]);

  const corner00hsl = hexToHsluv(corner00);
  const corner10hsl = hexToHsluv(corner10);
  const corner01hsl = hexToHsluv(corner01);
  const corner11hsl = hexToHsluv(corner11);

  const midLeftHsl = interpolateHsl(corner00hsl, corner01hsl);
  const midBottomHsl = interpolateHsl(corner00hsl, corner10hsl);
  const midTopHsl = interpolateHsl(corner01hsl, corner11hsl);
  const midRightHsl = interpolateHsl(corner10hsl, corner11hsl);
  const midMidHsl = interpolateHsl(midBottomHsl, midTopHsl);

  // put colors in specific way because x and y axises are swapped here
  const colorTheme: ColorTheme = [
    { id: 'A1', color: convertToRgbaWithOpacity(corner00) },
    { id: 'A2', color: convertToRgbaWithOpacity(hsluvToHex(midLeftHsl)) },
    { id: 'A3', color: convertToRgbaWithOpacity(corner01) },
    { id: 'B1', color: convertToRgbaWithOpacity(hsluvToHex(midBottomHsl)) },
    { id: 'B2', color: convertToRgbaWithOpacity(hsluvToHex(midMidHsl)) },
    { id: 'B3', color: convertToRgbaWithOpacity(hsluvToHex(midTopHsl)) },
    { id: 'C1', color: convertToRgbaWithOpacity(corner10) },
    { id: 'C2', color: convertToRgbaWithOpacity(hsluvToHex(midRightHsl)) },
    { id: 'C3', color: convertToRgbaWithOpacity(corner11) },
  ];

  const bivariateStyle = generateBivariateStyleForAxis({
    id: `${xAxis.quotient.join('&')}|${yAxis.quotient.join('&')}`,
    x: xAxis,
    y: yAxis,
    colors: colorTheme,
    sourceLayer: 'stats',
    source: {
      type: 'vector',
      tiles: [`${resolveUrl(config.tilesApi)}{z}/{x}/{y}.mvt`],
      maxzoom: stats?.meta.max_zoom,
      minzoom: 0,
    },
  });

  return [colorTheme, bivariateStyle];
}

export function generateLayerStyleFromBivariateLegend(
  bl: BivariateLegend,
): BivariateLayerStyle {
  return generateBivariateStyleForAxis({
    id: `${bl.axis.x.quotient.join('&')}|${bl.axis.y.quotient.join('&')}`,
    x: bl.axis.x,
    y: bl.axis.y,
    colors: [...bl.steps]
      .sort((stp1, stp2) => (stp1.label > stp2.label ? 1 : -1))
      .map((stp) => ({ id: stp.label, color: stp.color })),
    sourceLayer: 'stats',
  });
}

export function convertRGBtoObj(colorString: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const rgbKeys = ['r', 'g', 'b', 'a'] as const;
  const rgbObj: { [K in typeof rgbKeys[number]]?: number } = {};
  // rgba(number, number, number, number) => [number, number, number, number];
  const color = colorString.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

  rgbKeys.forEach((colorKey, colorIndex) => {
    rgbObj[colorKey] = parseFloat(color[colorIndex]) || 1;
  });

  return rgbObj as { [K in typeof rgbKeys[number]]: number };
}
