import {
  ApplicationLayer,
  ApplicationMap,
  ApplicationMapMarker,
} from '~components/ConnectedMap/ConnectedMap';
import { sideControlsBarAtom } from '~core/shared_state';
import { LogicalLayer } from '~core/logical_layers/createLogicalLayerAtom';
import { createGeoJSONSource } from '~utils/geoJSON/helpers';
import { boundariesClient } from '~core/index';
import { getSelectorWithOptions } from '@k2-packages/boundaries/tslib/getSelectorWithOptions';
import { convertToAppMarker } from '~utils/map/markers';
import {
  boundarySelector,
  constructOptionsFromBoundaries,
} from '~utils/map/boundaries';
import { layersOrderManager } from '~core/logical_layers/layersOrder';

import {
  HOVERED_BOUNDARIES_LAYER_ID,
  HOVERED_BOUNDARIES_SOURCE,
  BOUNDARY_MARKER_ID,
} from '../constants';
import { focusedGeometryAtom } from '~core/shared_state';

const LOADING_OPTIONS = [
  { label: 'Loading...', value: 'loading', disabled: true },
];
const DO_NOTHING = () => {
  /* do nothing */
};

const hoveredLayerConfig: ApplicationLayer = {
  id: HOVERED_BOUNDARIES_LAYER_ID,
  type: 'line',
  source: HOVERED_BOUNDARIES_SOURCE,
  paint: {
    'line-color': 'black',
    'line-width': 2,
    'line-opacity': 0.7,
  },
};

export class BoundarySelectorLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name?: string;
  private _isMounted = false;
  private _map?: ApplicationMap;
  private _currentMarker?: ApplicationMapMarker;
  private readonly _clickHandler: (ev: {
    lngLat: { lng: number; lat: number };
  }) => void;

  public constructor(id: string, name?: string) {
    this.id = id;
    if (name) {
      this.name = name;
    }
    this._clickHandler = this.onMapClick.bind(this);
  }

  get isMounted(): boolean {
    return this._isMounted;
  }

  public onInit() {
    return { isVisible: true, isLoading: false };
  }

  public willMount(map: ApplicationMap) {
    this._map = map;
    const emptyGeoJsonSource = createGeoJSONSource();
    map.addSource(HOVERED_BOUNDARIES_SOURCE, emptyGeoJsonSource);
    const beforeId = layersOrderManager.getBeforeIdByType(
      hoveredLayerConfig.type,
    );
    map.addLayer(hoveredLayerConfig, beforeId);
    map.on('click', this._clickHandler);
    this._isMounted = true;
  }

  public willUnmount(map: ApplicationMap) {
    if (!this._isMounted) return;
    this._map = undefined;
    map.removeLayer(hoveredLayerConfig.id);
    map.removeSource(HOVERED_BOUNDARIES_SOURCE);
    map.off('click', this._clickHandler);
    this.resetCurrentMarker();
    this._isMounted = false;
  }

  private resetCurrentMarker() {
    if (this._currentMarker) {
      this._currentMarker.remove();
      this._currentMarker = undefined;
    }
  }

  async onMapClick(ev: { lngLat: { lng: number; lat: number } }) {
    if (!this._map || !ev || !ev.lngLat) return;

    this.resetCurrentMarker();
    this._currentMarker = convertToAppMarker(BOUNDARY_MARKER_ID, {
      coordinates: [ev.lngLat.lng, ev.lngLat.lat],
      el: getSelectorWithOptions(LOADING_OPTIONS, DO_NOTHING, DO_NOTHING),
      id: BOUNDARY_MARKER_ID,
    });
    this._currentMarker.addTo(this._map);

    const responseData =
      await boundariesClient.get<GeoJSON.FeatureCollection | null>(
        '/layers/collections/bounds/itemsByMultipoint',
        { geom: `MULTIPOINT(${ev.lngLat.lng} ${ev.lngLat.lat})` },
      );

    if (!responseData) throw 'No data received';

    if (!responseData.features || !responseData.features.length) {
      // todo: Add empty boundaries callback
    }

    const selectBoundary = boundarySelector(responseData);

    const options = constructOptionsFromBoundaries(responseData);
    const markerData = getSelectorWithOptions(
      options,
      (boundaryId: string) => {
        const selectedBoundarySource = this._map?.getSource(
          HOVERED_BOUNDARIES_SOURCE,
        );
        if (selectedBoundarySource && 'setData' in selectedBoundarySource) {
          const geoJSON: GeoJSON.FeatureCollection = selectBoundary(
            boundaryId,
          ) as GeoJSON.FeatureCollection;
          const selectedFeatureName =
            responseData.features.find((feat) => feat.id === boundaryId)
              ?.properties?.name || 'Custom geometry';
          focusedGeometryAtom.setFocusedGeometry.dispatch(
            { type: 'boundaries', meta: selectedFeatureName },
            geoJSON,
          );
          sideControlsBarAtom.disable.dispatch('BoundarySelector');
        }
      },
      (boundaryId: string) => {
        const hoveredBoundarySource = this._map?.getSource(
          HOVERED_BOUNDARIES_SOURCE,
        );
        if (hoveredBoundarySource && 'setData' in hoveredBoundarySource) {
          hoveredBoundarySource.setData(
            selectBoundary(boundaryId) as GeoJSON.FeatureCollection,
          );
        }
      },
    );

    this.resetCurrentMarker();
    this._currentMarker = convertToAppMarker(BOUNDARY_MARKER_ID, {
      coordinates: [ev.lngLat.lng, ev.lngLat.lat],
      el: markerData,
      id: BOUNDARY_MARKER_ID,
    });
    this._currentMarker.addTo(this._map);
  }
}
