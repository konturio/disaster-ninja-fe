import type { LayerEditorFormFieldAtomType } from '~features/create_layer/atoms/layerEditorFormField';
import type { LayerDetailsLegend } from '~core/logical_layers/types/legends';
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

export type EditableLayerFieldType = typeof FieldTypes[keyof typeof FieldTypes];
export type EditTargetsType = typeof EditTargets[keyof typeof EditTargets];

export type EditableLayerFeaturePropertiesType = Record<
  string,
  EditableLayerFieldType
>;

export interface EditableLayerSettings {
  name: string;
  featureProperties: EditableLayerFeaturePropertiesType;
}

export interface TileSource {
  type: 'vector' | 'raster';
  tileSize: number;
  url: string[];
}

export interface GeoJSONSource {
  type: 'geojson';
  data: GeoJSON.FeatureCollection | GeoJSON.Feature;
}

export interface EditableLayers {
  id: string;
  name: string;
  source: TileSource | GeoJSONSource;
  description?: string;
  category?: 'base' | 'overlay';
  group?: string;
  copyrights?: string[];
  boundaryRequiredForRetrieval: boolean;
  eventIdRequiredForRetrieval?: boolean;
  ownedByUser: boolean;
  featureProperties?: EditableLayerFeaturePropertiesType;
}

export interface GeoJSONSourceSourceContainer {
  id: string;
  source: GeoJSONSource;
  legend: LayerDetailsLegend;
}

export interface TileSourceContainer {
  id: string;
  maxZoom: number;
  minZoom: number;
  source: TileSource;
  legend?: LayerDetailsLegend;
}

export type LayerInAreaDetails =
  | GeoJSONSourceSourceContainer
  | TileSourceContainer;
