import {  FeatureCollection } from '@nebula.gl/edit-modes/';
import {
  ModeProps,
  ImmutableFeatureCollection,
} from '@nebula.gl/edit-modes';
import { CustomModifyMode } from '@k2-packages/map-draw-tools/tslib/customDrawModes/CustomModifyMode';

// Source code https://gitlab.com/kontur-private/k2/k2-front-end/-/blob/master/k2-packages/map-draw-tools/src/customDrawModes/CustomModifyMode.ts
export class LocalModifyMode extends CustomModifyMode {

  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>) {
    event.stopPropagation();
    const { key } = event;

    if ((key === 'Delete' || key === 'Backspace') && this._selectedIndex !== -1) {
      const updatedData = new ImmutableFeatureCollection(props.data).deleteFeature(this._selectedIndex).getObject();
      props.onEdit({
        updatedData,
        editType: 'removeFeature',
        editContext: null,
      });

      this._selectedIndex = -1;
      this._currentSubMode = null;
    }
  }
}
