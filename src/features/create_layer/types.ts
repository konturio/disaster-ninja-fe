import { LayerFieldAtomType } from '~features/create_layer/atoms/createLayerField';

export type LayerFieldType =
  | 'none'
  | 'shorttext'
  | 'longtext'
  | 'link'
  | 'image';

export type LayerFieldModel = {
  name: string;
  type: LayerFieldType;
};

export type CreateLayerModel = {
  id: number;
  name: string;
  // TODO: change it to corresponding icon type
  marker: string;
  fields: LayerFieldAtomType[];
};
