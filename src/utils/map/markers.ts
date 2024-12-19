import { createRoot } from 'react-dom/client';
import { ApplicationMapMarker } from '~components/ConnectedMap/ConnectedMap';
import type { Marker } from '~core/types';

// wrap react element into HTMLElement
function renderInline(marker: Marker) {
  const container = document.createElement('div');
  container.className = marker.wrapperClass || '';
  const root = createRoot(container);
  root.render(marker.el);
  return container;
}

export function convertToAppMarker(id: string, marker: Marker): ApplicationMapMarker {
  const appMarker = new ApplicationMapMarker(id, renderInline(marker));
  appMarker.setLngLat(marker.coordinates);
  return appMarker;
}
