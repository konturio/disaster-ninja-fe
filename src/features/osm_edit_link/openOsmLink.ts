import { URL_ZOOM_OFFSET } from '~core/constants';

export function openOsmLink(
  { lat, lng, zoom },
  baseLink = 'https://www.openstreetmap.org/edit?#map=',
) {
  const url = `${baseLink}${zoom + URL_ZOOM_OFFSET}/${lat}/${lng}`;
  window.open(url)?.focus();
}
