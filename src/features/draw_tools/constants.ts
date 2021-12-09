import { TranslationService as i18n } from '~core/localization';

export const DRAW_TOOLS_CONTROL_ID = 'DrawTools';
export const DRAW_TOOLS_CONTROL_NAME = 'Draw Tools';
export const DRAW_TOOLS_LAYER_ID = 'draw-tools';

export const DRAW_MODE_CONFIG = {
  DrawPolygonMode: {
    disableSelfIntersections: true,
  },
  MeasureDistanceMode: {
    multipoint: true,
    turfOptions: { units: 'kilometers' },
    formatTooltip: (distance: number) => {
      const km = i18n.t('firebrigade:modules.measureDistanceMode.km');
      const m = i18n.t('firebrigade:modules.measureDistanceMode.m');
      const distanceLabel =
        distance > 1
          ? `${distance.toFixed(1)} ${km}.`
          : `${(distance * 1000).toFixed(2)} ${m}.`;
      const filler = new Array(distanceLabel.length + 2).join(' ');
      return `${distanceLabel}${filler}`;
    },
  },
};

export const drawModes = {
  DrawPolygonMode: 'DrawPolygonMode',
  ViewMode: 'ViewMode',
  DrawLineMode: 'DrawLineMode',
  DrawPointMode: 'DrawPointMode',
  ModifyMode: 'ModifyMode',
  DeleteMode: 'DeleteMode',
} as const;

export type DrawModeType = keyof typeof drawModes;
export const createDrawingLayers = ['DrawPolygonMode', 'DrawLineMode', 'DrawPointMode']
export const editDrawingLayers = ['ModifyMode', 'DeleteMode', 'ViewMode']

function hex2rgb(hex: string) {
  const value = parseInt(hex, 16);
  return [16, 8, 0].map((shift) => ((value >> shift) & 0xff) / 255);
}

const FEATURE_COLORS = [
  '00AEE4',
  'DAF0E3',
  '9BCC32',
  '07A35A',
  'F7DF90',
  'EA376C',
  '6A126A',
  'FCB09B',
  'B0592D',
  'C1B5E3',
  '9C805B',
  'CCDFE5',
].map(hex2rgb);

export function getDeckColorForFeature(index: number, bright: number, alpha: number) {
  const length = FEATURE_COLORS.length;
  const color = FEATURE_COLORS[index % length].map((c) => c * bright * 255);

  return [...color, alpha * 255];
}
