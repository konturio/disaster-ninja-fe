import { createAtom } from '~utils/atoms';
import { configRepo } from '~core/config';
import { mapPopoverRegistry } from '~core/map';
import { currentMapAtom } from '~core/shared_state';
import {
  constructOptionsFromBoundaries,
  type BoundaryOption,
} from '~utils/map/boundaries';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { i18n } from '~core/localization';
import { getCameraForGeometry } from '~utils/map/camera';
import { forceRun } from '~utils/atoms/forceRun';
import { store } from '~core/store/store';
import { FeatureCollection } from '~utils/geoJSON/helpers';
import { withoutUndefined } from '~utils/common/removeEmpty';
import { setCurrentMapPosition } from '~core/shared_state/currentMapPosition';
import { v3ActionToV2 } from '~utils/atoms/v3tov2';
import { boundarySelectorToolbarControl } from '../control';
import { boundarySelectorContentProvider } from '../components/BoundarySelectorContentProvider';
import { clickCoordinatesAtom } from './clickCoordinatesAtom';
import { boundaryResourceAtom } from './boundaryResourceAtom';
import { highlightedGeometryAtom } from './highlightedGeometry';
import type { ApplicationMapMarker } from '~components/ConnectedMap/ConnectedMap';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { Feature, GeoJsonProperties, Geometry } from 'geojson';

// Create empty geometry constant
const EMPTY_GEOMETRY = new FeatureCollection([]);

interface BoundaryMarkerAtomState {
  marker: null | ApplicationMapMarker;
  isEnabled: boolean;
  content?: {
    coordinates: {
      lat: number;
      lng: number;
    };
    uiState: 'loading' | 'no-data' | 'ready';
    options?: BoundaryOption[];
  };
}

export const boundaryMarkerAtom = createAtom(
  {
    currentMapAtom,
    clickCoordinatesAtom,
    boundaryResourceAtom,
    start: () => null,
    stop: () => null,
    hoverBoundary: (boundaryId: string) => boundaryId,
    selectBoundary: (boundaryId: string) => boundaryId,
  },
  (
    { get, onAction, schedule, onChange, create },
    state: BoundaryMarkerAtomState = {
      marker: null,
      isEnabled: false,
    },
  ) => {
    onAction('start', () => {
      state = { ...state, isEnabled: true };
      // Register content provider when tool becomes active
      mapPopoverRegistry.register('boundary-selector', boundarySelectorContentProvider);
    });

    onAction('stop', () => {
      // Unregister content provider when tool becomes inactive
      mapPopoverRegistry.unregister('boundary-selector');
      state = { ...state, isEnabled: false };
    });

    onAction('hoverBoundary', (boundaryId) => {
      const resource = get('boundaryResourceAtom');
      const { data: featureCollection } = resource;

      if (!featureCollection) return;

      const boundaryGeometry =
        findBoundaryGeometry(featureCollection, boundaryId) ?? EMPTY_GEOMETRY;

      // Highlight boundary geometry on map
      schedule((dispatch) => {
        dispatch(highlightedGeometryAtom.set(boundaryGeometry));
      });
    });

    onAction('selectBoundary', (boundaryId) => {
      const resource = get('boundaryResourceAtom');
      const map = get('currentMapAtom');
      const { data: featureCollection } = resource;

      if (!featureCollection || !map) return;

      const boundaryGeometry =
        findBoundaryGeometry(featureCollection, boundaryId) ?? EMPTY_GEOMETRY;

      const boundaryName = findBoundaryName(boundaryGeometry);
      const boundaryCamera = findCameraPositionForBoundary(map, boundaryGeometry);

      schedule((dispatch) => {
        dispatch(
          [
            // 1) cleanup:
            // Reset button state to default
            boundarySelectorToolbarControl.setState('regular'),
            // Clear highlightedGeometry
            highlightedGeometryAtom.set(EMPTY_GEOMETRY),

            // 2) focus:
            // Load selected boundary as focused geometry
            focusedGeometryAtom.setFocusedGeometry(
              {
                type: 'boundaries',
                meta: { name: boundaryName || 'Boundary geometry' },
              },
              boundaryGeometry,
            ),
            // Adjust map view to fit new geometry
            boundaryCamera &&
              v3ActionToV2(
                setCurrentMapPosition,
                boundaryCamera,
                'setCurrentMapPosition',
              ),

            // stop:
            create('stop'),
          ].filter(withoutUndefined),
        );
      });
    });

    // UI
    if (state.isEnabled) {
      onChange('boundaryResourceAtom', (resource) => {
        const { data: featureCollection, loading } = resource;
        const coordinates = get('clickCoordinatesAtom');
        const map = get('currentMapAtom');

        if (!coordinates || !map) {
          // User not select anything yet, or map not enabled
          return;
        }

        // Process resource state into semantic UI states
        if (loading) {
          state = {
            ...state,
            content: { coordinates, uiState: 'loading' },
          };
          // Clear previously highlighted geometry
          schedule((dispatch) => {
            dispatch(highlightedGeometryAtom.set(EMPTY_GEOMETRY));
          });
        } else if (!featureCollection) {
          state = {
            ...state,
            content: { coordinates, uiState: 'no-data' },
          };
        } else {
          // Create dropdown with boundaries options
          const options = constructOptionsFromBoundaries(featureCollection);

          if (options.length > 0) {
            state = {
              ...state,
              content: { coordinates, uiState: 'ready', options },
            };
          } else {
            state = {
              ...state,
              content: { coordinates, uiState: 'no-data' },
            };
          }
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

boundarySelectorToolbarControl.onInit((ctx) => {
  return forceRun(boundaryMarkerAtom);
});

boundarySelectorToolbarControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    store.dispatch(boundaryMarkerAtom.start());
  } else {
    store.dispatch(boundaryMarkerAtom.stop());
  }
});
