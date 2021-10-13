import { TranslationService as i18n } from '~core/localization';

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

export const polygonSelectionModes = {
  DrawPolygonMode: 'DrawPolygonMode',
  SelectBoundaryMode: 'SelectBoundaryMode',
  UploadMode: 'UploadMode',
  ViewMode: 'ViewMode',
  MeasureDistanceMode: 'MeasureDistanceMode',
} as const;

export const DRAW_TOOLS_CONTROLS = Object.values(polygonSelectionModes);

export const defaultPolygonSelectionMode = polygonSelectionModes.ViewMode;

export const boundaryLayers = [
  {
    id: 'hovered-boundaries-layer',
    type: 'line' as const,
    source: 'hovered-boundaries',
    paint: {
      'line-color': 'black',
      'line-width': 1,
      'line-opacity': 0.7,
    },
  },
  {
    id: 'selected-boundaries-layer',
    type: 'line' as const,
    source: 'selected-boundaries',
    paint: {
      'line-color': 'black',
      'line-width': 4,
      'line-opacity': 0.7,
    },
  },
];
