import turfCenter from '@turf/center';
import turfRhumbBearing from '@turf/rhumb-bearing';
import turfRhumbDistance from '@turf/rhumb-distance';
import turfRhumbDestination from '@turf/rhumb-destination';
import turfTransformTranslate from '@turf/transform-translate';
import type { Position, Feature, Geometry } from '@turf/helpers';
import type {
  LineStringCoordinates,
  MultiLineStringCoordinates,
  MultiPointCoordinates,
  MultiPolygonCoordinates,
  PolygonCoordinates,
} from '@nebula.gl/edit-modes';

type ComplexCoordinates =
  | LineStringCoordinates
  | PolygonCoordinates
  | MultiPointCoordinates
  | MultiLineStringCoordinates
  | MultiPolygonCoordinates;
type Coordinates = Position | Position[] | Position[][] | Position[][][];

export function translateByCenter(
  feature: Feature<Geometry>,
  distance: number,
  direction: number,
) {
  const initialCenterPoint = turfCenter(feature as Feature);

  const movedCenterPoint = turfTransformTranslate(
    initialCenterPoint,
    distance,
    direction,
  );

  const movedCoordinates = getTranslatedCoords(
    feature.geometry.coordinates,
    initialCenterPoint.geometry.coordinates as Position,
    movedCenterPoint.geometry.coordinates as Position,
  );

  feature.geometry.coordinates = movedCoordinates;

  return feature;
}

// it takes distance and direction for each coordinate from initial position
// and gives a new coordinate - placed on the same direction and distance to new position
function getTranslatedCoords(
  coords: Coordinates,
  initPosition: Position,
  newPostion: Position,
): Position | ComplexCoordinates {
  // if coordinate is a simple position - we can move it
  if (typeof coords[0] === 'number') {
    const distance = turfRhumbDistance(initPosition, coords as Position);
    const direction = turfRhumbBearing(initPosition, coords as Position);

    const movedPosition = turfRhumbDestination(newPostion, distance, direction)
      .geometry.coordinates;
    return movedPosition as Position;
  } else {
    // else dig in until simple position found
    return coords.map((coordinates) =>
      getTranslatedCoords(coordinates, initPosition, newPostion),
    ) as ComplexCoordinates;
  }
}
