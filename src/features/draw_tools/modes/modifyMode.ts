import { ClickEvent, FeatureCollection } from '@nebula.gl/edit-modes/';
import { ImmutableFeatureCollection, ModeProps } from '@nebula.gl/edit-modes';
import { CustomModifyMode } from '@k2-packages/map-draw-tools/tslib/customDrawModes/CustomModifyMode';

// Source code https://gitlab.com/kontur-private/k2/k2-front-end/-/blob/master/k2-packages/map-draw-tools/src/customDrawModes/CustomModifyMode.ts
export class LocalModifyMode extends CustomModifyMode {
  _selectedIndexes: number[] | null = null
  // _currentSubMode = this.createSubmode('Modify')

  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>) {
    event.stopPropagation();
    const { key } = event;

    if ((key === 'Delete' || key === 'Backspace') && this._selectedIndexes?.length) {

      let updatedData: FeatureCollection | undefined
      for (let i = 0; i < this._selectedIndexes.length; i++) {
        const index = this._selectedIndexes[i];
        updatedData = new ImmutableFeatureCollection(props.data).deleteFeature(index).getObject()
      }
      if (!updatedData) return;
      props.onEdit({
        updatedData,
        editType: 'removeFeature',
        editContext: null,
      });

      this._selectedIndexes = null;
      this._currentSubMode = null;
    }
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    let processSelection = false;

    if (event.picks && event.picks.length) {
      const lastPickIndex = event.picks[0].index;

      if (event.sourceEvent.shiftKey) {
        // pick first feature if none were picked
        if (!this._selectedIndexes) this._selectedIndexes = [lastPickIndex]

        // remove feature if it was picked before and clicked under SHIFT
        else if (this._selectedIndexes.includes(lastPickIndex))
          this._selectedIndexes = this._selectedIndexes.filter(index => index !== lastPickIndex)

        // add new feature picked under SHIFT
        else this._selectedIndexes = [...this._selectedIndexes, lastPickIndex]


        // Keep modifying
        processSelection = true;
        props.onEdit({
          updatedData: props.data,
          editType: 'selectFeature',
          editContext: {
            featureIndexes: this._selectedIndexes,
          },
        });

        this._currentSubMode = this.createSubmode('Modify');
      } else if (!this._selectedIndexes?.includes(lastPickIndex)) {
        processSelection = true;
        this._selectedIndexes = [lastPickIndex];
        props.onEdit({
          updatedData: props.data,
          editType: 'selectFeature',
          editContext: {
            featureIndexes: [lastPickIndex],
          },
        });
        this._currentSubMode = this.createSubmode('Modify');
      } else {
        processSelection = true;
        switch (this._currentSubModeName) {
          case 'Modify':
            this._currentSubMode = this.createSubmode('Transform');
            break;
          case 'Transform':
            this._currentSubMode = this.createSubmode('Modify');
            break;
        }
      }
    } else {
      this._selectedIndexes = null;
      props.onEdit({
        updatedData: props.data,
        editType: 'selectFeature',
        editContext: {
          featureIndexes: [],
        },
      });
      this._currentSubMode = null;
    }

    if (!processSelection && this._currentSubMode) {
      this._currentSubMode.handleClick(event, props);
    }
  }

}
