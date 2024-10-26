export function setMapInteractivity(
  map: maplibregl.Map | undefined,
  interactive: boolean,
) {
  if (!map) return console.warn('map was not provided');

  const interactionIsON = map.dragPan.isActive();
  // Case interactive already
  if (interactive && interactionIsON) return;
  // Case turn on interactivity
  else if (interactive) {
    map.boxZoom.enable();
    map.doubleClickZoom.enable();
    map.dragPan.enable();
    map.dragRotate.enable();
    map.keyboard.enable();
    map.scrollZoom.enable();
    map.touchZoomRotate.enable();
  }
  // Case non-interactive already
  else if (!interactive && !interactionIsON) return;
  // Case turn off interactivity
  else {
    map.boxZoom.disable();
    map.doubleClickZoom.disable();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.keyboard.disable();
    map.scrollZoom.disable();
    map.touchZoomRotate.disable();
  }
}
