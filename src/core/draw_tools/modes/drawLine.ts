import {
  ClickEvent,
  DrawLineStringMode,
  LineString,
  ModeProps,
} from '@nebula.gl/edit-modes';
import { FeatureCollection } from '@nebula.gl/edit-modes/';
import { getPickedEditHandle } from '@nebula.gl/edit-modes/dist/utils';
import mapLibre from 'maplibre-gl';

export class LocalDrawLineStringMode extends DrawLineStringMode {
  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>) {
    const { key } = event;
    if (key === 'Enter') {
      const clickSequence = this.getClickSequence();
      if (clickSequence.length > 1) {
        const lineStringToAdd: LineString = {
          type: 'LineString',
          coordinates: [...clickSequence, props.lastPointerMoveEvent.mapCoords],
        };

        this.resetClickSequence();
        // fix error for wrong props.data type
        if (Array.isArray(props.data))
          props.data = {
            features: [],
            type: 'FeatureCollection',
          };
        const editAction = this.getAddFeatureAction(
          lineStringToAdd,
          props.data,
        );
        if (editAction) {
          props.onEdit(editAction);
        }
      }
    }
  }
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const { picks } = event;
    const clickedEditHandle = getPickedEditHandle(picks);

    let positionAdded = false;
    if (!clickedEditHandle) {
      // Don't add another point right next to an existing one
      this.addClickSequence(event);
      positionAdded = true;
    }
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 1 &&
      clickedEditHandle &&
      Array.isArray(clickedEditHandle.properties.positionIndexes) &&
      clickedEditHandle.properties.positionIndexes[0] ===
        clickSequence.length - 1
    ) {
      // They clicked the last point (or double-clicked), so add the LineString

      const lineStringToAdd: LineString = {
        type: 'LineString',
        coordinates: [...clickSequence],
      };

      this.resetClickSequence();

      // fix error for wrong props.data type
      if (Array.isArray(props.data))
        props.data = {
          features: [],
          type: 'FeatureCollection',
        };
      const editAction = this.getAddFeatureAction(lineStringToAdd, props.data);
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

  handlePointerMove(event, props: ModeProps<FeatureCollection>) {
    super.handlePointerMove(event, props);
    props.onUpdateCursor('cell');
  }
}
