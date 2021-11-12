import {
  generateBivariateStyleForAxis,
  Stat,
} from '@k2-packages/bivariate-tools';
import interpolate from 'color-interpolate';
import { ColorTheme } from '~appModule/types';
import config from '~core/app_config';

export interface BivariateLayerStyle {
  id: string;
  type: string;
  source: any;
  layout: unknown;
  filter: any[];
  paint: {
    'fill-color': any[];
    'fill-opacity': number;
    'fill-antialias': boolean;
  };
}

function resolveUrl(url: string) {
  const isRelative = url.startsWith('/');
  return isRelative ? `${window.location.origin}${url}` : url;
}

function convertColorWithOpacity(hexColor: string): string {
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

function findColors(colors: any, crn: any[]): string {
  const corner1 = Array.isArray(crn[0]) ? crn[0] : [crn[0]];
  const corner2 = Array.isArray(crn[1]) ? crn[1] : [crn[1]];
  const mergedCorner = [...corner1];
  corner2.forEach((clr: string) => {
    if (mergedCorner.indexOf(clr) === -1) {
      mergedCorner.push(clr);
    }
  });
  const combination = colors.combinations.find(({ corner }) => {
    let isEqual = mergedCorner.length === corner.length;
    if (isEqual) {
      for (let i = 0; i < mergedCorner.length; i += 1) {
        if (mergedCorner[i] !== corner[i]) {
          isEqual = false;
          break;
        }
      }
    }
    return isEqual;
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

  const corner00 = convertColorWithOpacity(
    findColors(colors, [xAxisDirection[0], yAxisDirection[0]]),
  );
  const corner10 = convertColorWithOpacity(
    findColors(colors, [xAxisDirection[1], yAxisDirection[0]]),
  );
  const corner01 = convertColorWithOpacity(
    findColors(colors, [xAxisDirection[0], yAxisDirection[1]]),
  );
  const corner11 = convertColorWithOpacity(
    findColors(colors, [xAxisDirection[1], yAxisDirection[1]]),
  );

  const midLeft = interpolate([corner00, corner01])(0.5);
  const midBottom = interpolate([corner00, corner10])(0.5);
  const midTop = interpolate([corner01, corner11])(0.5);
  const midRight = interpolate([corner10, corner11])(0.5);
  const midMid = interpolate([midBottom, midTop])(0.5);

  // put colors in specific way because x and y axises are swapped here
  const colorTheme: ColorTheme = [
    { id: 'A1', color: corner00 },
    { id: 'A2', color: midLeft },
    { id: 'A3', color: corner01 },
    { id: 'B1', color: midBottom },
    { id: 'B2', color: midMid },
    { id: 'B3', color: midTop },
    { id: 'C1', color: corner10 },
    { id: 'C2', color: midRight },
    { id: 'C3', color: corner11 },
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
