import { URL_ZOOM_OFFSET } from '~core/constants';

export function openOsmLink(
  { lat, lng, zoom },
  baseLink = 'https://www.openstreetmap.org/edit#map=',
) {
  const url = `${baseLink}${zoom + URL_ZOOM_OFFSET}/${lat}/${lng}`;
  window.open(url)?.focus();
}

function calculateMaxJosmArea(
  lat: number,
  lng: number,
): { left: number; right: number; top: number; bottom: number } {
  const maxSize = 0.5 / 3.5;

  const left = lng - maxSize / 2;
  const right = lng + maxSize / 2;
  const top = lat + maxSize / 2;
  const bottom = lat - maxSize / 2;

  return { left, right, top, bottom };
}

export function openJosmLink(
  { lat, lng },
  baseLink = 'http://127.0.0.1:8111/load_and_zoom',
) {
  const { left, bottom, right, top } = calculateMaxJosmArea(lat, lng);
  const url = `${baseLink}?left=${left}&right=${right}&top=${top}&bottom=${bottom}`;
  window.open(url)?.focus();
}
