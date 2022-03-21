export const UserDataFieldShortTextType = 'short_text';
export const UserDataFieldLongTextType = 'long_text';
export const UserDataFieldImage = 'image';
export const UserDataFieldLink = 'link';

export type UserDataFieldType = typeof UserDataFieldShortTextType
  | typeof UserDataFieldLongTextType
  | typeof UserDataFieldImage
  | typeof UserDataFieldLink;

export interface LayerUserData {
  name?: string[];
  featureProperties?: Record<string, UserDataFieldType>;
}
