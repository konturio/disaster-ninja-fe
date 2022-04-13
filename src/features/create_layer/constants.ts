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
    label: 'Select',
    type: FieldTypes.None,
  },
  {
    label: 'Short Text',
    type: FieldTypes.ShortText,
  },
  {
    label: 'Long Text',
    type: FieldTypes.LongText,
  },
  {
    label: 'Link',
    type: FieldTypes.Link,
  },
  {
    label: 'Image',
    type: FieldTypes.Image,
  },
];

// Move this constant to backend user settings later
export const MAX_USER_LAYER_ALLOWED_TO_CREATE = 1;

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
