import { createAtom } from '~utils/atoms/createPrimitives';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { currentEditedLayerFeatures } from './currentEditedLayerFeatures';

const currentSelectedFeatureIndex = createAtom({ drawnGeometryAtom }, ({ get }) =>
  get('drawnGeometryAtom').features.findIndex((f) => f.properties?.isSelected),
);

export const currentSelectedFeature = createAtom(
  {
    currentSelectedFeatureIndex,
    currentEditedLayerFeatures,
    updateProperties: (properties: GeoJSON.GeoJsonProperties) => properties,
    setPosition: (position: { lng: number; lat: number }) => position,
    deleteFeature: () => null,
  },
  (
    { get, onAction, schedule, getUnlistedState },
    state: null | GeoJSON.Feature = null,
  ): typeof state => {
    const currentSelectedFeatureIndex = get('currentSelectedFeatureIndex');
    if (currentSelectedFeatureIndex === -1) return null;

    onAction('updateProperties', (properties) => {
      const currentFeature =
        getUnlistedState(drawnGeometryAtom).features[currentSelectedFeatureIndex];
      const updatedProperties = {
        ...currentFeature.properties,
        ...properties,
      };
      schedule((d) => {
        d(
          currentEditedLayerFeatures.setFeatureProperty(
            currentSelectedFeatureIndex,
            updatedProperties,
          ),
        );
      });
    });

    const layerFeatures = get('currentEditedLayerFeatures');
    if (layerFeatures === null) {
      return null;
    }

    return layerFeatures[currentSelectedFeatureIndex];
  },
);
