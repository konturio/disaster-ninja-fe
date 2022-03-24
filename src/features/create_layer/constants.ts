import {
  UserDataFieldImage,
  UserDataFieldLink,
  UserDataFieldLongTextType, UserDataFieldNoneType,
  UserDataFieldShortTextType,
} from '~core/logical_layers/types/userData';

export const CREATE_LAYER_CONTROL_ID = 'CreateLayer';

export const USER_LAYER_FIELDS = [
  {
    label: 'Select',
    type: UserDataFieldNoneType
  },
  {
    label: 'Short Text',
    type: UserDataFieldShortTextType
  },
  {
    label: 'Long Text',
    type: UserDataFieldLongTextType
  },
  {
    label: 'Link',
    type: UserDataFieldLink
  },
  {
    label: 'Image',
    type: UserDataFieldImage
  }
];

// Move this constant to backend user settings later
export const MAX_USER_LAYER_ALLOWED_TO_CREATE = 1;
