import { createAtom } from '~utils/atoms/createPrimitives';
import { drawnGeometryAtom } from '~core/draw_tools/atoms/drawnGeometryAtom';
import { currentEditedLayerFeatures } from './currentEditedLayerFeatures';

const currentSelectedPointIndex = createAtom({ drawnGeometryAtom }, ({ get }) =>
  get('drawnGeometryAtom').features.findIndex((f) => f.properties?.isSelected),
);

export const currentSelectedPoint = createAtom(
  {
    currentSelectedPointIndex,
    currentEditedLayerFeatures,
    updateProperties: (properties: GeoJSON.GeoJsonProperties) => properties,
    setPosition: (position: { lng: number; lat: number }) => position,
    deleteFeature: () => null,
  },
  (
    { get, onAction, schedule, getUnlistedState },
    state: null | GeoJSON.Feature = null,
  ): typeof state => {
    const currentSelectedPointIndex = get('currentSelectedPointIndex');
    if (currentSelectedPointIndex === -1) return null;

    onAction('updateProperties', (properties) => {
      const currentFeature =
        getUnlistedState(drawnGeometryAtom).features[currentSelectedPointIndex];
      const updatedProperties = {
        ...currentFeature.properties,
        ...properties,
      };
      schedule((d) => {
        d(
          currentEditedLayerFeatures.setFeatureProperty(
            currentSelectedPointIndex,
            updatedProperties,
          ),
        );
      });
    });

    onAction('setPosition', (position) => {
      console.error('setPosition Not implemented yet');
    });

    onAction('deleteFeature', () => {
      schedule((d) => {
        d(drawnGeometryAtom.removeByIndexes([currentSelectedPointIndex]));
      });
    });

    const layerFeatures = get('currentEditedLayerFeatures');
    if (layerFeatures === null) {
      return null;
    }

    return layerFeatures[currentSelectedPointIndex];
  },
);
