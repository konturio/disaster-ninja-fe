import {
  ClickEvent,
  FeatureCollection,
  ModeProps,
} from '@nebula.gl/edit-modes';
import { CustomModifyMode } from '@k2-packages/map-draw-tools/tslib/customDrawModes/CustomModifyMode';
import { selectedIndexesAtom } from '../atoms/selectedIndexesAtom';

// Source code https://gitlab.com/kontur-private/k2/k2-front-end/-/blob/master/k2-packages/map-draw-tools/src/customDrawModes/CustomModifyMode.ts
export class LocalModifyMode extends CustomModifyMode {
  _selectedIndexes: number[] = [];
  static previousSelection: number[] = [];

  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>) {
    event.stopPropagation();
    const { key } = event;

    if (key === 'Delete' || key === 'Backspace') {
      const selectedIndexes = selectedIndexesAtom.getState();
      if (!selectedIndexes.length) return;
      const clearedFeatures = props.data.features.filter(
        (f, index) => !selectedIndexes.includes(index),
      );
      const featureCollection: FeatureCollection = {
        ...props.data,
        features: clearedFeatures,
      };

      props.onEdit({
        updatedData: featureCollection,
        editType: 'removeFeature',
        editContext: null,
      });

      selectedIndexesAtom.setIndexes([]);
      this._selectedIndexes = [];
      this._currentSubMode = null;
    }
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    let processSelection = false;

    if (event.picks && event.picks.length) {
      const firstNotGuidePickIndex =
        event.picks.find((pick) => !pick.isGuide)?.index ?? 0;

      const featureIsPoint: boolean = (function () {
        // I assume point features never have picks as guides
        const firstPick = event.picks[0];
        if (firstPick.isGuide) return false;
        if (firstPick.object?.geometry?.type === 'Point') return true;
        return false;
      })();

      if (event.sourceEvent.shiftKey) {
        // remove feature if it was picked before and clicked under SHIFT
        if (
          LocalModifyMode.previousSelection.includes(firstNotGuidePickIndex)
        ) {
          const selectedIndexes = this._selectedIndexes.filter(
            (index) => index !== firstNotGuidePickIndex,
          );
          selectedIndexesAtom.setIndexes(selectedIndexes);
          this._selectedIndexes = selectedIndexes;
        }
        // add new feature picked under SHIFT
        else {
          const indexes = [
            ...LocalModifyMode.previousSelection,
            firstNotGuidePickIndex,
          ];
          selectedIndexesAtom.setIndexes(indexes);
          this._selectedIndexes = indexes;
        }

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
      } else if (
        !LocalModifyMode.previousSelection.includes(firstNotGuidePickIndex)
      ) {
        processSelection = true;
        selectedIndexesAtom.setIndexes([firstNotGuidePickIndex]);
        this._selectedIndexes = [firstNotGuidePickIndex];
        props.onEdit({
          updatedData: props.data,
          editType: 'selectFeature',
          editContext: {
            featureIndexes: [firstNotGuidePickIndex],
          },
        });
        this._currentSubMode = this.createSubmode('Modify');
      } else if (event.picks.length === 1 || featureIsPoint) {
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
      selectedIndexesAtom.setIndexes([]);
      this._selectedIndexes = [];
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

  getGuides(props) {
    // getGuides() for rotate mode with no features will throw error
    if (!props.data?.features?.length || !props.selectedIndexes?.length)
      return null;
    return this._currentSubMode ? this._currentSubMode.getGuides(props) : null;
  }
}
