export const UserDataFieldNoneType = 'none';
export const UserDataFieldShortTextType = 'short_text';
export const UserDataFieldLongTextType = 'long_text';
export const UserDataFieldImage = 'image';
export const UserDataFieldLink = 'link';

export type UserDataFieldType =
  | typeof UserDataFieldNoneType
  | typeof UserDataFieldShortTextType
  | typeof UserDataFieldLongTextType
  | typeof UserDataFieldImage
  | typeof UserDataFieldLink;

export type UserDataFeaturePropertiesType = Record<string, UserDataFieldType>;

export interface LayerUserData {
  name: string;
  featureProperties: UserDataFeaturePropertiesType;
}
