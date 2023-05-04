import { h3ToGeoBoundary } from 'h3-js';

function fixTransmeridianLoop(loop: number[][]) {
  let isTransmeridian = false;
  for (let i = 0; i < loop.length; i++) {
    // check for arcs > 180 degrees longitude, flagging as transmeridian
    if (Math.abs(loop[0][0] - loop[(i + 1) % loop.length][0]) > 180) {
      isTransmeridian = true;
      break;
    }
  }
  if (isTransmeridian) {
    loop.forEach(fixTransmeridianCoord);
  }
}

function fixTransmeridianCoord(coord: number[]) {
  const lng = coord[0];
  coord[0] = lng < 0 ? lng + 360 : lng;
}

export function getH3Polygon(h3Index: string): GeoJSON.Geometry {
  const h3Boundary = h3ToGeoBoundary(h3Index, true);
  fixTransmeridianLoop(h3Boundary);

  return {
    type: 'Polygon',
    coordinates: [h3Boundary],
  };
}
