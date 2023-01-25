import { createAtom } from '~utils/atoms';
import { currentMapAtom, currentMapPositionAtom } from '~core/shared_state';
import { appConfig } from '~core/app_config';
import { constructOptionsFromBoundaries } from '~utils/map/boundaries';
import { convertToAppMarker } from '~utils/map/markers';
import { toolbarControlsAtom, focusedGeometryAtom } from '~core/shared_state';
import { i18n } from '~core/localization';
import { getCameraForGeometry } from '~utils/map/cameraForGeometry';
import { BOUNDARY_MARKER_ID } from '../constants';
import { clickCoordinatesAtom } from './clickCoordinatesAtom';
import { boundaryResourceAtom } from './boundaryResourceAtom';
import { highlightedGeometry } from './highlightedGeometry';
import { getSelectorWithOptions } from './../components/getSelectorWithOptions';
import type { ApplicationMapMarker } from '~components/ConnectedMap/ConnectedMap';
import type { Action } from '@reatom/core';

const LOADING_OPTION = [{ label: i18n.t('loading'), value: 'loading', disabled: true }];
const NO_DATA_OPTION = [
  { label: i18n.t('no_data_received'), value: 'no_data_received', disabled: true },
];

interface BoundaryMarkerAtomState {
  marker: null | ApplicationMapMarker;
  isEnabled: boolean;
}

let version = 0;

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
      // The only way to update marker content?
      const previousMarker = state.marker;
      previousMarker?.remove();
      newMarker.addTo(map);

      state = { ...state, marker: newMarker };
    });

    // Marker callbacks
    const updateFocusedGeometryAction = (feature: GeoJSON.Feature) => {
      const name = (feature.properties?.name as string) || 'Boundary geometry';
      return focusedGeometryAtom.setFocusedGeometry(
        {
          type: 'boundaries',
          meta: { name },
        },
        feature,
      );
    };

    const updateBoundaryLayerAction = (
      fc: GeoJSON.FeatureCollection,
      boundaryId: string,
    ) => {
      const feature = fc.features.find((boundary) => boundary.id === boundaryId);
      return highlightedGeometry.set(
        feature || { type: 'FeatureCollection', features: [] },
      );
    };

    // Marker creation
    if (state.isEnabled) {
      onChange('boundaryResourceAtom', (resource) => {
        const { data: featureCollection, loading } = resource;

        const coordinates = get('clickCoordinatesAtom');
        const map = get('currentMapAtom');
        if (!coordinates || !map) return;

        schedule((dispatch) => {
          let selectOptions =
            resource.data && constructOptionsFromBoundaries(resource.data);
          if (!selectOptions?.length)
            selectOptions = loading ? LOADING_OPTION : NO_DATA_OPTION;

          const markerData = getSelectorWithOptions(
            selectOptions,

            // onOptionSelect:
            (boundaryId) => {
              if (!featureCollection) return;
              const selectedFeature = featureCollection.features.find(
                (f) => f.id === boundaryId,
              );

              const actions: Action[] = [
                toolbarControlsAtom.disable('BoundarySelector'),
                updateBoundaryLayerAction(
                  { type: 'FeatureCollection', features: [] },
                  boundaryId,
                ),
              ];

              if (!selectedFeature) return dispatch(actions);

              actions.push(updateFocusedGeometryAction(selectedFeature));

              const geometryCamera = getCameraForGeometry(selectedFeature, map);
              if (typeof geometryCamera === 'object') {
                actions.push(
                  currentMapPositionAtom.setCurrentMapPosition({
                    zoom: Math.min(geometryCamera.zoom, appConfig.autoFocus.maxZoom),
                    ...geometryCamera.center,
                  }),
                );
              }
              dispatch(actions);
            },

            // onOptionHover:
            (boundaryId) => {
              if (!featureCollection) return;
              dispatch(updateBoundaryLayerAction(featureCollection, boundaryId));
            },
          );

          const marker = convertToAppMarker(BOUNDARY_MARKER_ID + version, {
            coordinates: [coordinates.lng, coordinates.lat],
            el: markerData,
            id: BOUNDARY_MARKER_ID,
          });

          // increment marker version to debug
          version++;

          dispatch(create('_refreshMarker', marker, map));
        });
      });
    }

    return state;
  },
  'boundaryMarkerAtom',
);
