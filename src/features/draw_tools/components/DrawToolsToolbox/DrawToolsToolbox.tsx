import { Button, Text } from '@k2-packages/ui-kit';
import { useCallback } from 'react';
import { TranslationService as i18n } from '~core/localization';
import s from './DrawToolToolbox.module.css';
import {
  DrawLineIcon,
  DrawPointIcon,
  DrawPolygonIcon,
  TrashBinIcon,
} from '@k2-packages/default-icons';
import { useAtom } from '@reatom/react';
import { activeDrawModeAtom } from '~features/draw_tools/atoms/activeDrawMode';
import clsx from 'clsx';
import { drawModes, DRAW_TOOLS_CONTROL_ID } from '~features/draw_tools/constants';
import { modeWatcherAtom } from '~features/draw_tools/atoms/drawLayerAtom';
import { selectedIndexesAtom } from '~features/draw_tools/atoms/selectedIndexesAtom';
import { drawnGeometryAtom } from '~features/draw_tools/atoms/drawnGeometryAtom';
import { sideControlsBarAtom } from '~core/shared_state';
import { drawingIsStartedAtom } from '~features/draw_tools/atoms/drawingIsStartedAtom';

export const DrawToolsToolbox = () => {
  const [activeDrawMode, { setDrawMode, toggleDrawMode }] = useAtom(activeDrawModeAtom);
  const [selected] = useAtom(selectedIndexesAtom)
  const [, { removeByIndexes }] = useAtom(drawnGeometryAtom)
  const [, { disable: disableSideIcon }] = useAtom(sideControlsBarAtom)
  const [drawingIsStarted, { setIsStarted }] = useAtom(drawingIsStartedAtom)
  useAtom(modeWatcherAtom);

  const onPolygonClick = useCallback(
    () => {
      toggleDrawMode(drawModes.DrawPolygonMode);
    }, [],
  );
  
  const onLineClick = useCallback(
    () => {
      toggleDrawMode(drawModes.DrawLineMode);
    }, [],
  );
  const onPointClick = useCallback(
    () => {
      toggleDrawMode(drawModes.DrawPointMode);
    }, [],
  );

  const finishDrawing = useCallback(
    () => {
      disableSideIcon(DRAW_TOOLS_CONTROL_ID)
      setDrawMode(undefined);
    },
    [setDrawMode],
  );

  const onDelete = useCallback(
    () => {
      if (selected.length) removeByIndexes(selected)
    },
    [selected],
  );


  return activeDrawMode ? (
    <div className={s.drawToolsContainer}>
      {!drawingIsStarted && <div className={s.drawHint}>
        <Text type="caption">
          <span className={s.drawHintText}>{i18n.t('Click on the map to begin drawing')}</span>
        </Text>
      </div>}

      <div className={s.toolBox}>
        <Button className={s.modeBtn} active={activeDrawMode === drawModes.DrawPolygonMode} onClick={onPolygonClick}>
          <div className={s.btnContent}>
            <DrawPolygonIcon /> {i18n.t('Area')}
          </div>
        </Button>
        <Button className={s.modeBtn} active={activeDrawMode === drawModes.DrawLineMode} onClick={onLineClick}>
          <div className={s.btnContent}>
            <DrawLineIcon /> {i18n.t('Line')}
          </div>
        </Button>
        <Button className={s.modeBtn} active={activeDrawMode === drawModes.DrawPointMode} onClick={onPointClick}>
          <div className={s.btnContent}>
            <DrawPointIcon /> {i18n.t('Point')}
          </div>
        </Button>
        <Button className={s.modeBtn} active={Boolean(selected.length)} onClick={onDelete}>
          <div className={s.btnContent}>
            <TrashBinIcon />
          </div>
        </Button>
        {/* this is temporary  */}
        <Button className={s.finishBtn} onClick={() => finishDrawing()}>
          <div className={clsx(s.btnContent)}>{i18n.t('Finish Drawing')}</div>
        </Button>
      </div>
    </div>
  ) : null;
};
