import { useCallback } from 'react';
import { icons } from '@k2-packages/map-draw-tools';
import { setActiveDrawMode } from '~appModule/actions';
import config from '~config/runtime';
import { connect, ConnectedProps } from 'react-redux';
import ActionButton from '~components/shared/ActionButton/ActionButton';
import clsx from 'clsx';
import { StateWithAppModule } from '~appModule/types';
import * as selectors from '~appModule/selectors';
import styles from './PolygonSelectionToolbox.module.css';

const mapStateToProps = (state: StateWithAppModule) => ({
  activeDrawMode: selectors.activeDrawMode(state),
});

const mapDispatchToProps = (dispatch) => ({
  enablePolygonSelection: () =>
    dispatch(setActiveDrawMode(config.polygonSelectionModes[0] as any)),
  enableBoundarySelection: () =>
    dispatch(config.polygonSelectionModes[1] as any),
  enableUploadPolygon: () =>
    dispatch(setActiveDrawMode(config.polygonSelectionModes[2] as any)),
  disablePolygonSelection: () =>
    dispatch(setActiveDrawMode(config.defaultPolygonSelectionMode as any)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const PolygonSelectionToolbox = ({
  activeDrawMode,
  enablePolygonSelection,
  enableBoundarySelection,
  disablePolygonSelection,
  enableUploadPolygon,
}: ConnectedProps<typeof connector>) => {
  const SelectPolygonIcon = icons[config.polygonSelectionModes[0]];
  const SelectBoundaryIcon = icons[config.polygonSelectionModes[1]];
  const UploadPolygonIcon = icons[config.polygonSelectionModes[2]];

  const onSelectPolygonClick = useCallback(() => {
    if (activeDrawMode === config.polygonSelectionModes[0]) {
      disablePolygonSelection();
    } else {
      enablePolygonSelection();
    }
  }, [enablePolygonSelection, disablePolygonSelection, activeDrawMode]);

  const onSelectBoundaryClick = useCallback(() => {
    if (activeDrawMode === config.polygonSelectionModes[1]) {
      disablePolygonSelection();
    } else {
      enableBoundarySelection();
    }
  }, [enableBoundarySelection, disablePolygonSelection, activeDrawMode]);

  const onSelectUploadPolygon = useCallback(() => {
    if (activeDrawMode === config.polygonSelectionModes[2]) {
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
            activeDrawMode === config.polygonSelectionModes[0],
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
            activeDrawMode === config.polygonSelectionModes[1],
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
            activeDrawMode === config.polygonSelectionModes[2],
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
