import {
  GeoJsonEditMode,
  ModifyMode,
  // TransformMode,
  ImmutableFeatureCollection,
} from '@nebula.gl/edit-modes';
import { CustomTransformMode } from './CustomTransformMode';
import type { FeatureCollection } from '@nebula.gl/edit-modes/dist/geojson-types';
import type {
  ModeProps,
  ClickEvent,
  PointerMoveEvent,
  GuideFeatureCollection,
  DraggingEvent,
  StartDraggingEvent,
  StopDraggingEvent,
} from '@nebula.gl/edit-modes/dist/types';
import type { CompositeMode } from '@nebula.gl/edit-modes';

type SubmodeType = GeoJsonEditMode | CompositeMode;

export class CustomModifyMode extends GeoJsonEditMode {
  _submodesCache: { [key: string]: SubmodeType } = {};
  _currentSubMode: SubmodeType | null = null;
  _currentSubModeName = '';
  _selectedIndex = -1;

  // on click
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    let processSelection = false;

    if (event.picks && event.picks.length) {
      const lastPickIndex = event.picks[event.picks.length - 1].index;
      if (this._selectedIndex !== lastPickIndex) {
        processSelection = true;
        this._selectedIndex = lastPickIndex;
        props.onEdit({
          updatedData: props.data,
          editType: 'selectFeature',
          editContext: {
            featureIndexes: [lastPickIndex],
          },
        });
        this._currentSubMode = this.createSubmode('Modify');
      } else if (event.picks.length === 1) {
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
      this._selectedIndex = -1;
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

  createSubmode(submodeName: string): SubmodeType {
    this._currentSubModeName = submodeName;
    if (!this._submodesCache[this._currentSubModeName]) {
      switch (submodeName) {
        case 'Modify':
          this._submodesCache[submodeName] = new ModifyMode();
          break;
        case 'Transform':
          this._submodesCache[submodeName] = new CustomTransformMode();
          break;
      }
    }
    return this._submodesCache[this._currentSubModeName];
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    return this._currentSubMode ? this._currentSubMode.getGuides(props) : null;
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._currentSubMode) {
      this._currentSubMode.handleDragging(event, props);
    }
  }

  handleStartDragging(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this._currentSubMode) {
      this._currentSubMode.handleStartDragging(event, props);
    }
  }

  handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this._currentSubMode) {
      this._currentSubMode.handleStopDragging(event, props);
    }
  }

  handlePointerMove(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>,
  ) {
    if (this._currentSubMode) {
      this._currentSubMode.handlePointerMove(event, props);
    }
  }

  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>) {
    event.stopPropagation();
    const { key } = event;

    if (
      (key === 'Delete' || key === 'Backspace') &&
      this._selectedIndex !== -1
    ) {
      const updatedData = new ImmutableFeatureCollection(props.data)
        .deleteFeature(this._selectedIndex)
        .getObject();
      props.onEdit({
        updatedData,
        editType: 'removeFeature',
        editContext: null,
      });

      this._selectedIndex = -1;
      props.onEdit({
        updatedData: props.data,
        editType: 'selectFeature',
        editContext: {
          featureIndexes: [],
        },
      });
      this._currentSubMode = null;
    }
  }
}
