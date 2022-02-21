import { Atom } from '@reatom/core';

export type LayerFieldType = 'none' | 'shorttext' | 'longtext' | 'image';

export type LayerFieldModel = {
  name: string;
  type: LayerFieldType;
}

export type CreateLayerModel = {
  id: number;
  name: string;
  // TODO: change it to corrensponding icon type
  marker: string;
  fields: Atom<LayerFieldModel>[];
}
