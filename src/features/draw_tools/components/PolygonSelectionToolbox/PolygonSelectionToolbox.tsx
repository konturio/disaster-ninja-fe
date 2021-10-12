import { useCallback } from 'react';
import { icons } from '@k2-packages/map-draw-tools';
import { setActiveDrawMode } from '~appModule/actions';
import {
  polygonSelectionModes,
  defaultPolygonSelectionMode,
} from '../../constants';
import { connect, ConnectedProps } from 'react-redux';
import ActionButton from '~components/ActionButton/ActionButton';
import clsx from 'clsx';
import { StateWithAppModule } from '~appModule/types';
import * as selectors from '~appModule/selectors';
import styles from './PolygonSelectionToolbox.module.css';

const mapStateToProps = (state: StateWithAppModule) => ({
  activeDrawMode: selectors.activeDrawMode(state),
});

const mapDispatchToProps = (dispatch) => ({
  enablePolygonSelection: () =>
    dispatch(setActiveDrawMode(polygonSelectionModes.DrawPolygonMode)),
  enableBoundarySelection: () =>
    dispatch(setActiveDrawMode(polygonSelectionModes.SelectBoundaryMode)),
  enableUploadPolygon: () =>
    dispatch(setActiveDrawMode(polygonSelectionModes.UploadMode)),
  disablePolygonSelection: () =>
    dispatch(setActiveDrawMode(defaultPolygonSelectionMode)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const PolygonSelectionToolbox = ({
  activeDrawMode,
  enablePolygonSelection,
  enableBoundarySelection,
  disablePolygonSelection,
  enableUploadPolygon,
}: ConnectedProps<typeof connector>) => {
  const SelectPolygonIcon = icons[polygonSelectionModes.DrawPolygonMode];
  const SelectBoundaryIcon = icons[polygonSelectionModes.SelectBoundaryMode];
  const UploadPolygonIcon = icons[polygonSelectionModes.UploadMode];

  const onSelectPolygonClick = useCallback(() => {
    if (activeDrawMode === polygonSelectionModes.SelectBoundaryMode) {
      disablePolygonSelection();
    } else {
      enablePolygonSelection();
    }
  }, [enablePolygonSelection, disablePolygonSelection, activeDrawMode]);

  const onSelectBoundaryClick = useCallback(() => {
    if (activeDrawMode === polygonSelectionModes.SelectBoundaryMode) {
      disablePolygonSelection();
    } else {
      enableBoundarySelection();
    }
  }, [enableBoundarySelection, disablePolygonSelection, activeDrawMode]);

  const onSelectUploadPolygon = useCallback(() => {
    if (activeDrawMode === polygonSelectionModes.UploadMode) {
      disablePolygonSelection();
    } else {
      enableUploadPolygon();
    }
  }, [enableUploadPolygon, disablePolygonSelection, activeDrawMode]);

  return (
    <div className={styles.polygonSelectionToolbox}>
      <ActionButton
        className={clsx({
          [styles.leftButton]: true,
          [styles.buttonPressed]:
            activeDrawMode === polygonSelectionModes.SelectBoundaryMode,
        })}
        onClick={onSelectPolygonClick}
        type="action"
        hint="Draw polygon"
      >
        <SelectPolygonIcon />
      </ActionButton>
      <ActionButton
        className={clsx({
          [styles.middleButton]: true,
          [styles.buttonPressed]:
            activeDrawMode === polygonSelectionModes.SelectBoundaryMode,
        })}
        onClick={onSelectBoundaryClick}
        type="action"
        hint="Select boundary"
      >
        <SelectBoundaryIcon />
      </ActionButton>
      <ActionButton
        className={clsx({
          [styles.rightButton]: true,
          [styles.buttonPressed]:
            activeDrawMode === polygonSelectionModes.UploadMode,
        })}
        onClick={onSelectUploadPolygon}
        type="action"
        hint="Upload polygon"
      >
        <UploadPolygonIcon />
      </ActionButton>
    </div>
  );
};

export default connector(PolygonSelectionToolbox);
