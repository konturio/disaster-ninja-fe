/**
 * Show feature if property 'zoom' === current map zoom
 * OR
 * Show feature if current zoom >= 10 and feature zoom prop === 10
 */
const FILTER = [
  'any',
  ['==', ['number', ['get', 'zoom']], ['zoom']],
  ['all', ['>=', ['zoom'], 12], ['==', ['number', ['get', 'zoom']], 12]],
];

export function addZoomFilter(layers) {
  layers.forEach((l) => {
    if (l.filter) {
      l.filter = ['all', FILTER, l.filter];
    } else {
      l.filter = FILTER;
    }
  });
}

export function onActiveContributorsClick(map, sourceId) {
  return (ev) => {
    if (!ev || !ev.lngLat) return;
    const thisLayersFeatures = ev.target
      .queryRenderedFeatures(ev.point)
      .filter((f) => f.source.includes(sourceId));

    if (thisLayersFeatures.length === 0) return;
    const featureWithLink = thisLayersFeatures.find(
      (feature) => feature.properties.top_user !== undefined,
    );
    if (featureWithLink === undefined) return;
    const link = featureWithLink.properties.top_user;
    window.open('https://www.openstreetmap.org/user/' + link);
  };
}
