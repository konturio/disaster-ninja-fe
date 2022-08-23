export const CREATE_LAYER_CONTROL_ID = 'EditableLayer' as const;

export const FieldTypes = {
  None: 'none',
  ShortText: 'short_text',
  LongText: 'long_text',
  Image: 'image',
  Link: 'link',
} as const;

export const EditTargets = {
  features: 'features',
  layer: 'layer',
  none: null,
} as const;

export const USER_LAYER_FIELDS = [
  {
    label: 'create_layer.select',
    type: FieldTypes.None,
  },
  {
    label: 'create_layer.short_text',
    type: FieldTypes.ShortText,
  },
  {
    label: 'create_layer.long_text',
    type: FieldTypes.LongText,
  },
  {
    label: 'create_layer.link',
    type: FieldTypes.Link,
  },
  {
    label: 'create_layer.image',
    type: FieldTypes.Image,
  },
];

export const TEMPORARY_USER_LAYER_LEGEND = {
  type: 'simple',
  steps: [
    {
      stepName: 'Point',
      stepShape: 'circle',
      style: {
        'icon-image': 'marker-15',
        'symbol-z-order': 'viewport-y',
        'icon-allow-overlap': true,
        'fill-color': 'black',
      },
    },
  ],
};
