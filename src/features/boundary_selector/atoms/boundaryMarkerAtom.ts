import { createAtom } from '~utils/atoms';
import { currentMapAtom, currentMapPositionAtom } from '~core/shared_state';
import { configRepo } from '~core/config';
import { constructOptionsFromBoundaries } from '~utils/map/boundaries';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { i18n } from '~core/localization';
import { getCameraForGeometry } from '~utils/map/camera';
import { forceRun } from '~utils/atoms/forceRun';
import { store } from '~core/store/store';
import { FeatureCollection } from '~utils/geoJSON/helpers';
import { withoutUndefined } from '~utils/common/removeEmpty';
import { boundarySelectorControl } from '../control';
import { createDropdownAsMarker } from '../utils/createDropdownAsMarker';
import { clickCoordinatesAtom } from './clickCoordinatesAtom';
import { boundaryResourceAtom } from './boundaryResourceAtom';
import { highlightedGeometryAtom } from './highlightedGeometry';
import type { ApplicationMapMarker } from '~components/ConnectedMap/ConnectedMap';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { Feature, GeoJsonProperties, Geometry } from 'geojson';
// prettier-ignore
const LOADING_OPTION = { label: i18n.t('loading'), value: 'loading', disabled: true };

const NO_DATA_OPTION = {
  label: i18n.t('no_data_received'),
  value: 'no_data_received',
  disabled: true,
};

interface BoundaryMarkerAtomState {
  marker: null | ApplicationMapMarker;
  isEnabled: boolean;
}

export const boundaryMarkerAtom = createAtom(
  {
    currentMapAtom,
    clickCoordinatesAtom,
    boundaryResourceAtom,
    start: () => null,
    stop: () => null,
    _refreshMarker: (marker: ApplicationMapMarker, map: maplibregl.Map) => {
      return { marker, map };
    },
  },
  (
    { get, onAction, schedule, onChange, create },
    state: BoundaryMarkerAtomState = {
      marker: null,
      isEnabled: false,
    },
  ) => {
    onChange('currentMapAtom', (map) => {
      if (map && state.isEnabled && state.marker) {
        state.marker.addTo(map);
      }
    });

    onAction('start', () => {
      const map = get('currentMapAtom');
      if (map && state.marker) state.marker.addTo(map);
      state = { ...state, isEnabled: true };
    });

    onAction('stop', () => {
      state.marker && state.marker.remove();
      state = { ...state, isEnabled: false, marker: null };
    });

    onAction('_refreshMarker', ({ marker: newMarker, map }) => {
      const previousMarker = state.marker;
      state = { ...state, marker: newMarker };

      schedule(() => {
        // The only way to update marker content?
        previousMarker?.remove();
        newMarker.addTo(map);
      });
    });

    // Marker creation
    if (state.isEnabled) {
      onChange('boundaryResourceAtom', (resource) => {
        const { data: featureCollection, loading } = resource;
        const coordinates = get('clickCoordinatesAtom');
        const map = get('currentMapAtom');
        if (!coordinates || !map) {
          // User not select anything yet, or map not enabled
          return;
        }

        // While data loading
        if (loading) {
          const emptyGeometry = new FeatureCollection([]);
          const selectOptions = [LOADING_OPTION];
          schedule((dispatch) => {
            dispatch([
              // Create dropdown with "Loading..." option
              create(
                '_refreshMarker',
                createDropdownAsMarker(coordinates, selectOptions),
                map,
              ),
              // Clear previously highlighted geometry
              highlightedGeometryAtom.set(emptyGeometry),
            ]);
          });
        } else {
          // Response received
          let geometry = featureCollection;
          if (!geometry) {
            console.error(`Expected boundary geometry, but got ${geometry}`);
            geometry = new FeatureCollection([]);
          }
          // Create dropdown with boundaries options
          // prettier-ignore
          const selectOptions = (
            resource.data &&
            constructOptionsFromBoundaries(resource.data)
          ) ?? [NO_DATA_OPTION];

          // Define what to do when user interact with boundaries options
          const dropdownListeners = {
            onHover: (boundaryId: string) => {
              if (!featureCollection) return;
              const boundaryGeometry =
                findBoundaryGeometry(featureCollection, boundaryId) ??
                new FeatureCollection([]);

              // Highlight boundary geometry on map
              store.dispatch(highlightedGeometryAtom.set(boundaryGeometry));
            },
            onSelect: (boundaryId: string) => {
              if (!featureCollection) return;
              const boundaryGeometry =
                findBoundaryGeometry(featureCollection, boundaryId) ??
                new FeatureCollection([]);

              const boundaryName = findBoundaryName(boundaryGeometry);
              const boundaryCamera = findCameraPositionForBoundary(map, boundaryGeometry);

              store.dispatch(
                [
                  // Reset button state to default
                  boundarySelectorControl.setState('regular'),
                  // Clear highlightedGeometry
                  highlightedGeometryAtom.set({
                    type: 'FeatureCollection',
                    features: [],
                  }),
                  // Load selected boundary as focused geometry
                  focusedGeometryAtom.setFocusedGeometry(
                    {
                      type: 'boundaries',
                      meta: { name: boundaryName || 'Boundary geometry' },
                    },
                    boundaryGeometry,
                  ),
                  // Adjust map view to fin new geometry
                  boundaryCamera &&
                    currentMapPositionAtom.setCurrentMapPosition(boundaryCamera),
                ].filter(withoutUndefined),
              );
            },
          };

          // Create dropdown with boundaries options
          schedule((dispatch) => {
            dispatch(
              create(
                '_refreshMarker',
                createDropdownAsMarker(coordinates, selectOptions, dropdownListeners),
                map,
              ),
            );
          });
        }
      });
    }

    return state;
  },
  'boundaryMarkerAtom',
);

const findBoundaryName = (
  featureCollection: FeatureCollection | Feature<Geometry, GeoJsonProperties>,
) => 'properties' in featureCollection && (featureCollection.properties?.name as string);

const findBoundaryGeometry = (featureCollection: FeatureCollection, boundaryId: string) =>
  featureCollection.features.find((boundary) => boundary.id === boundaryId);

const findCameraPositionForBoundary = (
  map: ApplicationMap,
  featureCollection: FeatureCollection | Feature<Geometry, GeoJsonProperties>,
) => {
  const geometryCamera = getCameraForGeometry(featureCollection, map);
  if (
    typeof geometryCamera?.zoom === 'number' &&
    geometryCamera.center &&
    'lat' in geometryCamera.center &&
    'lng' in geometryCamera.center
  ) {
    return {
      zoom: Math.min(geometryCamera.zoom, configRepo.get().autofocusZoom),
      ...geometryCamera.center,
    };
  }
};

boundarySelectorControl.onInit((ctx) => {
  return forceRun(boundaryMarkerAtom);
});

boundarySelectorControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    store.dispatch(boundaryMarkerAtom.start());
  } else {
    store.dispatch(boundaryMarkerAtom.stop());
  }
});
