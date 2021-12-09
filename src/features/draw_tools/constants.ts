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
  DrawLineMode: 'DrawLineMode',
  DrawPointMode: 'DrawPointMode',
  ModifyMode: 'ModifyMode',
} as const;

export type DrawModeType = keyof typeof drawModes;
export const createDrawingLayers = ['DrawPolygonMode', 'DrawLineMode', 'DrawPointMode']
export const editDrawingLayers = ['ModifyMode']

