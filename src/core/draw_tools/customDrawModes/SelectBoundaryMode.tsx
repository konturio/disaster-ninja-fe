import { GeoJsonEditMode } from '@nebula.gl/edit-modes';
import type {
  ClickEvent,
  ModeProps,
  FeatureCollection,
  PointerMoveEvent,
} from '@nebula.gl/edit-modes';

export class SelectBoundaryMode extends GeoJsonEditMode {
  // on click
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    props.onEdit({
      // data is the same
      updatedData: props.data,
      editType: 'selectBoundary',
      editContext: {
        position: event.mapCoords,
      },
    });
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }
}
