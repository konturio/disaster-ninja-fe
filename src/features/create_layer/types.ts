import { LayerFieldAtomType } from '~features/create_layer/atoms/createLayerField';
import { UserDataFieldType } from '~core/logical_layers/types/userData';

export type LayerFieldModel = {
  name: string;
  type: UserDataFieldType;
};

export type CreateLayerModel = {
  id?: string;
  name: string;
  // TODO: change it to corresponding icon type
  marker: string;
  fields: LayerFieldAtomType[];
};
