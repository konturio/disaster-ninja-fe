import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import mapLibre from 'maplibre-gl';
import type { Marker as MapMarker } from 'maplibre-gl';
import type { Marker } from './types';

function isReact(el: { props?: any }): boolean {
  return el.props !== undefined;
}

function renderInline(reactElement: React.ReactElement) {
  const container = document.createElement('div');
  ReactDOM.render(reactElement, container);
  return container;
}

function convertToMapBoxGLMarkers(markers: Marker[] = []): MapMarker[] {
  return markers.map((m) => {
    return new mapLibre.Marker(isReact(m.el) ? renderInline(m.el) : m.el).setLngLat(
      m.coordinates,
    );
  });
}

export function useMarkers(markers?: Marker[]) {
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    if (markers === undefined) {
      setMapMarkers([]);
      return;
    }

    setMapMarkers(convertToMapBoxGLMarkers(markers));
  }, [markers]);

  return mapMarkers;
}
