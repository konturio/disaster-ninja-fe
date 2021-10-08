import { useCallback } from 'react';
import { icons } from '@k2-packages/map-draw-tools';
import { setActiveDrawMode } from '~appModule/actions';
import config from '~core/app_config/runtime';
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
    dispatch(setActiveDrawMode(config.polygonSelectionModes.DrawPolygonMode)),
  enableBoundarySelection: () =>
    dispatch(
      setActiveDrawMode(config.polygonSelectionModes.SelectBoundaryMode),
    ),
  enableUploadPolygon: () =>
    dispatch(setActiveDrawMode(config.polygonSelectionModes.UploadMode)),
  disablePolygonSelection: () =>
    dispatch(setActiveDrawMode(config.defaultPolygonSelectionMode)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const PolygonSelectionToolbox = ({
  activeDrawMode,
  enablePolygonSelection,
  enableBoundarySelection,
  disablePolygonSelection,
  enableUploadPolygon,
}: ConnectedProps<typeof connector>) => {
  const SelectPolygonIcon = icons[config.polygonSelectionModes.DrawPolygonMode];
  const SelectBoundaryIcon =
    icons[config.polygonSelectionModes.SelectBoundaryMode];
  const UploadPolygonIcon = icons[config.polygonSelectionModes.UploadMode];

  const onSelectPolygonClick = useCallback(() => {
    if (activeDrawMode === config.polygonSelectionModes.SelectBoundaryMode) {
      disablePolygonSelection();
    } else {
      enablePolygonSelection();
    }
  }, [enablePolygonSelection, disablePolygonSelection, activeDrawMode]);

  const onSelectBoundaryClick = useCallback(() => {
    if (activeDrawMode === config.polygonSelectionModes.SelectBoundaryMode) {
      disablePolygonSelection();
    } else {
      enableBoundarySelection();
    }
  }, [enableBoundarySelection, disablePolygonSelection, activeDrawMode]);

  const onSelectUploadPolygon = useCallback(() => {
    if (activeDrawMode === config.polygonSelectionModes.UploadMode) {
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
            activeDrawMode === config.polygonSelectionModes.SelectBoundaryMode,
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
            activeDrawMode === config.polygonSelectionModes.SelectBoundaryMode,
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
            activeDrawMode === config.polygonSelectionModes.UploadMode,
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
