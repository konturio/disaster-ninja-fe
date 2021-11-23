import {
  ClickEvent,
  PointerMoveEvent,
  ModeProps,
  GuideFeatureCollection,
  TentativeFeature,
} from '@nebula.gl/edit-modes/dist/types';
import { Polygon, FeatureCollection, Position } from '@nebula.gl/edit-modes/';
import { getPickedEditHandle } from '@nebula.gl/edit-modes/dist/utils';
import { CustomDrawPolygonMode } from '@k2-packages/map-draw-tools/tslib/customDrawModes/CustomDrawPolygonMode';
import { GeoJsonEditMode } from '@nebula.gl/edit-modes';

export function handleClick(
  this: CustomDrawPolygonMode,
  event: ClickEvent,
  props: ModeProps<FeatureCollection>,
) {
  console.log('%c⧭', 'color: #00ff88', event, props, this);
  const { picks } = event;
  const clickedEditHandle = getPickedEditHandle(picks);

  let positionAdded = false;
  if (!clickedEditHandle) {
    // Don't add another point right next to an existing one
    this['addClickSequence'](event);
    positionAdded = true;
  }
  const clickSequence = this['getClickSequence']();

  if (
    clickSequence.length > 2 &&
    clickedEditHandle &&
    Array.isArray(clickedEditHandle.properties.positionIndexes) &&
    (clickedEditHandle.properties.positionIndexes[0] === 0 ||
      clickedEditHandle.properties.positionIndexes[0] ===
        clickSequence.length - 1)
  ) {
    // They clicked the first or last point (or double-clicked), so complete the polygon

    const polygonCoords = [...clickSequence, clickSequence[0]];

    if (this.intersectionsTest(props, polygonCoords)) return;

    // Remove the hovered position
    const polygonToAdd: Polygon = {
      type: 'Polygon',
      coordinates: [polygonCoords],
    };

    this['resetClickSequence']();

    console.log(polygonToAdd, props);
    let editAction: any;
    try {
      editAction = this['getAddFeatureOrBooleanPolygonAction'](
        polygonToAdd,
        props,
      );
    } catch (error) {
      console.log('%c⧭', 'color: #994d75', error);
    }
    if (editAction) {
      props.onEdit(editAction);
    }
  } else if (positionAdded) {
    // new tentative point
    props.onEdit({
      // data is the same
      updatedData: props.data,
      editType: 'addTentativePosition',
      editContext: {
        position: event.mapCoords,
      },
    });
  }
}
