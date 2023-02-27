import type { LayerSummaryDto } from '~core/logical_layers/types/source';
import type { LayerEditorFormFieldAtomType } from '~features/create_layer/atoms/layerEditorFormField';
import type { FieldTypes, EditTargets } from './constants';

export type LayerFieldModel = {
  name: string;
  type: EditableLayerFieldType;
};

export type LayerEditorFormModel = {
  id?: string;
  name: string;
  // TODO: change it to corresponding icon type
  marker: string;
  fields: LayerEditorFormFieldAtomType[];
};

/* Backend layer DTO received from /search endpoint */

export type EditableLayerFieldType = (typeof FieldTypes)[keyof typeof FieldTypes];
export type EditTargetsType = (typeof EditTargets)[keyof typeof EditTargets];

export type EditableLayerFeaturePropertiesType = Record<string, EditableLayerFieldType>;

export interface EditableLayerSettings {
  name: string;
  featureProperties: EditableLayerFeaturePropertiesType;
}

export interface EditableLayers extends LayerSummaryDto {
  featureProperties?: EditableLayerFeaturePropertiesType;
}
