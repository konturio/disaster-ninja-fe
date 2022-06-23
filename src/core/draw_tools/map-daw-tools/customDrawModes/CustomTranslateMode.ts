import turfRhumbBearing from '@turf/rhumb-bearing';
import turfRhumbDistance from '@turf/rhumb-distance';
import { point } from '@turf/helpers';
import {
  ImmutableFeatureCollection,
  TranslateMode,
} from '@nebula.gl/edit-modes';
import clone from '@turf/clone';
import { translateByCenter } from './translateByCenter';
import type { GeoJsonEditAction } from '@nebula.gl/edit-modes/dist-types/lib/geojson-edit-mode';
import type {
  FeatureCollection,
  Geometry,
  ModeProps,
  Position} from '@nebula.gl/edit-modes';
import type { Feature as TurfFeature } from '@turf/helpers';

// extension for @nebula.gl/edit-modes 1.0.2-alpha.0
export class CustomTranslateMode extends TranslateMode {
  getTranslateAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>,
  ): GeoJsonEditAction | null | undefined {
    if (!this._geometryBeforeTranslate) {
      return null;
    }
    const p1 = point(startDragPoint);
    const p2 = point(currentPoint);

    const distanceMoved = turfRhumbDistance(p1, p2);
    const direction = turfRhumbBearing(p1, p2);

    const movedFeatures = this._geometryBeforeTranslate.features.map((f) =>
      translateByCenter(clone(f as TurfFeature), distanceMoved, direction),
    );

    let updatedData = new ImmutableFeatureCollection(props.data);

    const selectedIndexes = props.selectedIndexes;
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = movedFeatures[i];
      updatedData = updatedData.replaceGeometry(
        selectedIndex,
        movedFeature.geometry as Geometry,
      );
    }

    return {
      updatedData: updatedData.getObject(),
      editType,
      editContext: {
        featureIndexes: selectedIndexes,
      },
    };
  }
}
