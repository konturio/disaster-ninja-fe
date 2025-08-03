import { i18n } from '~core/localization';
import type { SimpleLegend } from '~core/logical_layers/types/legends';
export const CREATE_LAYER_CONTROL_ID = 'EditableLayer' as const;
export const CUSTOM_LAYER_DRAW_TOOLS_CONTROL = 'customLayerDrawToolsControl';
export const CREATE_LAYER_CONTROL_NAME = i18n.t('toolbar.create_layer');

export const FieldTypes = {
  None: 'none',
  ShortText: 'short_text',
  LongText: 'long_text',
} as const;

export const EditTargets = {
  features: 'features',
  layer: 'layer',
  none: null,
} as const;

export const USER_LAYER_FIELDS = [
  {
    label: i18n.t('create_layer.short_text'),
    type: FieldTypes.ShortText,
  },
  {
    label: i18n.t('create_layer.long_text'),
    type: FieldTypes.LongText,
  },
];

export const DEFAULT_USER_LAYER_LEGEND: Omit<SimpleLegend, 'name'> = {
  type: 'simple',
  steps: [
    {
      stepName: 'Point',
      stepShape: 'circle',
      style: {
        'icon-image': 'marker-15',
        'symbol-z-order': 'viewport-y',
        'icon-allow-overlap': true,
        color: '#000000',
        width: 3,
      },
    },
  ],
};
