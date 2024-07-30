import { URL_ZOOM_OFFSET } from '~core/constants';

// Функция для открытия ссылки в редакторах OpenStreetMap, iD и RapiD
export function openOsmLink(
  { lat, lng, zoom },
  baseLink = 'https://www.openstreetmap.org/edit#map=',
) {
  const url = `${baseLink}${zoom + URL_ZOOM_OFFSET}/${lat}/${lng}`;
  window.open(url)?.focus();
}

// Функция для открытия ссылки в JOSM
export function openJosmLink(
  bbox: [number, number, number, number],
  baseLink = 'http://127.0.0.1:8111/load_and_zoom?',
) {
  const [left, bottom, right, top] = bbox;
  const url = `${baseLink}left=${left}&right=${right}&top=${top}&bottom=${bottom}`;
  window.open(url)?.focus();
}
