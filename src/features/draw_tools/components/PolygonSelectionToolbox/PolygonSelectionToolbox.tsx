import { useCallback } from 'react';
import clsx from 'clsx';
import { useAtom } from '@reatom/react';
import { icons } from '@k2-packages/map-draw-tools';
import ActionButton from '~components/ActionButton/ActionButton';
import { activeDrawModeAtom } from '~features/draw_tools/atoms/activeDrawMode';
import { drawModes } from '../../constants';
import styles from './PolygonSelectionToolbox.module.css';

export const PolygonSelectionToolbox = ({
  enablePolygonSelection,
  disablePolygonSelection,
}) => {
  const [activeDrawMode] = useAtom(activeDrawModeAtom);
  const SelectPolygonIcon = icons[drawModes.DrawPolygonMode];

  const onSelectPolygonClick = useCallback(() => {
    if (activeDrawMode === drawModes.SelectBoundaryMode) {
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
            activeDrawMode === drawModes.SelectBoundaryMode,
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
