import ReactDOM from 'react-dom';
import { ApplicationMapMarker } from '~components/ConnectedMap/ConnectedMap';
import type { Marker } from '~core/types';

// wrap react element into HTMLElement
function renderInline(reactElement: React.ReactElement) {
  const container = document.createElement('div');
  ReactDOM.render(reactElement, container);
  return container;
}

export function convertToAppMarker(
  id: string,
  marker: Marker,
): ApplicationMapMarker {
  const appMarker = new ApplicationMapMarker(id, renderInline(marker.el));
  appMarker.setLngLat(marker.coordinates);
  return appMarker;
}
