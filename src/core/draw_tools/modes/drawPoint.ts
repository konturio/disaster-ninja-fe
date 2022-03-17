import { ClickEvent, DrawPointMode, ModeProps } from '@nebula.gl/edit-modes';
import { FeatureCollection } from '@nebula.gl/edit-modes/';

export class LocalDrawPointMode extends DrawPointMode {
  handleClick(
    { mapCoords }: ClickEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    // props.data.features must be [] but we were passing props.data as []
    if (Array.isArray(props.data))
      props.data = {
        features: [],
        type: 'FeatureCollection',
      };

    props.onEdit(
      this.getAddFeatureAction(
        {
          type: 'Point',
          coordinates: mapCoords,
        },
        props.data,
      ),
    );
  }

  handlePointerMove(event, props: ModeProps<FeatureCollection>) {
    super.handlePointerMove(event, props);
    props.onUpdateCursor('cell');
  }
}
