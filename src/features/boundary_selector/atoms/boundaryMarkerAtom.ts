import { createAtom } from '~utils/atoms';
import { currentMapAtom, currentMapPositionAtom } from '~core/shared_state';
import app_config from '~core/app_config';
import { constructOptionsFromBoundaries } from '~utils/map/boundaries';
import { convertToAppMarker } from '~utils/map/markers';
import { sideControlsBarAtom, focusedGeometryAtom } from '~core/shared_state';
import { i18n } from '~core/localization';
import { getCameraForGeometry } from '~utils/map/cameraForGeometry';
import { BOUNDARY_MARKER_ID } from '../constants';
import { clickCoordinatesAtom } from './clickCoordinatesAtom';
import { boundaryResourceAtom } from './boundaryResourceAtom';
import { highlightedGeometry } from './highlightedGeometry';
import { getSelectorWithOptions } from './../components/getSelectorWithOptions';
import type { ApplicationMapMarker } from '~components/ConnectedMap/ConnectedMap';
import type { Action } from '@reatom/core';

const LOADING_OPTIONS = [
  { label: i18n.t('Loading...'), value: 'loading', disabled: true },
];

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
    _setMarker: (marker: ApplicationMapMarker) => marker,
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

    onAction('_setMarker', (marker) => {
      state = { ...state, marker };
    });

    // Marker callbacks
    const updateFocusedGeometryAction = (feature: GeoJSON.Feature) => {
      const name = (feature.properties?.name as string) || 'Boundary geometry';
      return focusedGeometryAtom.setFocusedGeometry(
        {
          type: 'boundaries',
          meta: name,
        },
        feature,
      );
    };

    const updateBoundaryLayerAction = (
      fc: GeoJSON.FeatureCollection,
      boundaryId: string,
    ) => {
      const feature = fc.features.find(
        (boundary) => boundary.id === boundaryId,
      )!;
      return highlightedGeometry.set(feature);
    };

    // Marker creation
    if (state.isEnabled) {
      onChange('boundaryResourceAtom', (resource) => {
        const { data: featureCollection } = resource;
        const coordinates = get('clickCoordinatesAtom');
        const map = get('currentMapAtom');
        if (!coordinates || !map) return;

        schedule((dispatch) => {
          const options = resource.data
            ? constructOptionsFromBoundaries(resource.data)
            : LOADING_OPTIONS;

          const markerData = getSelectorWithOptions(
            options,

            // onOptionSelect:
            (boundaryId) => {
              if (!featureCollection) return;
              const selectedFeature = featureCollection.features.find(
                (f) => f.id === boundaryId,
              )!;

              const actions: Action[] = [
                updateFocusedGeometryAction(selectedFeature),
                sideControlsBarAtom.disable('BoundarySelector'),
                updateBoundaryLayerAction(
                  { type: 'FeatureCollection', features: [] },
                  boundaryId,
                ),
              ];

              const geometryCamera = getCameraForGeometry(selectedFeature, map);
              if (typeof geometryCamera === 'object')
                actions.push(
                  currentMapPositionAtom.setCurrentMapPosition({
                    zoom: Math.min(
                      geometryCamera.zoom,
                      app_config.autoFocus.maxZoom,
                    ),
                    ...geometryCamera.center,
                  }),
                );

              dispatch(actions);
            },

            // onOptionHover:
            (boundaryId) => {
              if (!featureCollection) return;
              dispatch(
                updateBoundaryLayerAction(featureCollection, boundaryId),
              );
            },
          );

          const marker = convertToAppMarker(BOUNDARY_MARKER_ID, {
            coordinates: [coordinates.lng, coordinates.lat],
            el: markerData,
            id: BOUNDARY_MARKER_ID,
          });

          // The only way to update marker content?
          state.marker && state.marker.remove();
          marker.addTo(map);
          dispatch(create('_setMarker', marker));
        });
      });
    }

    return state;
  },
  'boundaryMarkerAtom',
);
