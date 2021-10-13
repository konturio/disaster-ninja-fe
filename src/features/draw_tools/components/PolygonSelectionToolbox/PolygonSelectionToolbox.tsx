import { useCallback } from 'react';
import { icons } from '@k2-packages/map-draw-tools';
import { polygonSelectionModes } from '../../constants';
import ActionButton from '~components/ActionButton/ActionButton';
import clsx from 'clsx';
import styles from './PolygonSelectionToolbox.module.css';
import { useAtom } from '@reatom/react';
import { activeDrawModeAtom } from '~features/draw_tools/atoms/activeDrawMode';

export const PolygonSelectionToolbox = ({
  enablePolygonSelection,
  disablePolygonSelection,
}) => {
  const [activeDrawMode] = useAtom(activeDrawModeAtom);
  const SelectPolygonIcon = icons[polygonSelectionModes.DrawPolygonMode];

  const onSelectPolygonClick = useCallback(() => {
    if (activeDrawMode === polygonSelectionModes.SelectBoundaryMode) {
      disablePolygonSelection();
    } else {
      enablePolygonSelection();
    }
  }, [enablePolygonSelection, disablePolygonSelection, activeDrawMode]);

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
    </div>
  );
};
