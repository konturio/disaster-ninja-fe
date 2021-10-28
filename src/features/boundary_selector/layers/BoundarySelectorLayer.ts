import {
  ApplicationLayer,
  ApplicationMap,
  ApplicationMapMarker,
} from '~components/ConnectedMap/ConnectedMap';
import { IMapLogicalLayer } from '~core/shared_state/mapLogicalLayersAtom';
import { createGeoJSONSource } from '~utils/geoJSON/helpers';
import { boundariesClient } from '~core/index';
import { getSelectorWithOptions } from '@k2-packages/boundaries/tslib/getSelectorWithOptions';
import { convertToAppMarker } from '~utils/map/markers';
import {
  boundarySelector,
  constructOptionsFromBoundaries,
} from '~utils/map/boundaries';

// todo: move constants to separate file
export const HOVERED_BOUNDARIES_LAYER_ID = 'hovered-boundaries-layer';
export const HOVERED_BOUNDARIES_SOURCE = 'hovered-boundaries';
export const SELECTED_BOUNDARIES_LAYER_ID = 'selected-boundaries-layer';
export const SELECTED_BOUNDARIES_SOURCE = 'selected-boundaries';
export const BOUNDARY_MARKER_ID = 'boundary-marker';

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
    'line-width': 1,
    'line-opacity': 0.7,
  },
};

const selectedLayerConfig: ApplicationLayer = {
  id: SELECTED_BOUNDARIES_LAYER_ID,
  type: 'line' as const,
  source: SELECTED_BOUNDARIES_SOURCE,
  paint: {
    'line-color': 'black',
    'line-width': 4,
    'line-opacity': 0.7,
  },
};

export class BoundarySelectorLayer implements IMapLogicalLayer {
  public readonly id: string;
  public readonly name?: string;
  private _isMounted = false;
  private _map?: ApplicationMap;
  private readonly _clickHandler: (ev: {
    lngLat: { lng: number; lat: number };
  }) => void;
  private _currentMarker?: ApplicationMapMarker;

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

  onMount(map: ApplicationMap) {
    this._map = map;
    const emptyGeoJsonSource = createGeoJSONSource();
    map.addSource(HOVERED_BOUNDARIES_SOURCE, emptyGeoJsonSource);
    map.addSource(SELECTED_BOUNDARIES_SOURCE, emptyGeoJsonSource);

    map.addLayer(hoveredLayerConfig);
    map.addLayer(selectedLayerConfig);

    map.on('click', this._clickHandler);
    this._isMounted = true;
  }

  onUnmount(map: ApplicationMap) {
    map.off('click', this._clickHandler);
    this._map = undefined;
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
          SELECTED_BOUNDARIES_SOURCE,
        );
        if (selectedBoundarySource && 'setData' in selectedBoundarySource) {
          selectedBoundarySource.setData(
            selectBoundary(boundaryId) as GeoJSON.FeatureCollection,
          );
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
