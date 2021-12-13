import { Button, Text } from '@k2-packages/ui-kit';
import { useCallback, useState } from 'react';
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
import { CLOSE_DRAW_HINT, drawModes, DrawModeType, DRAW_TOOLS_CONTROL_ID } from '~features/draw_tools/constants';
import { modeWatcherAtom } from '~features/draw_tools/atoms/drawLayerAtom';
import { selectedIndexesAtom } from '~features/draw_tools/atoms/selectedIndexesAtom';
import { drawnGeometryAtom } from '~features/draw_tools/atoms/drawnGeometryAtom';
import { sideControlsBarAtom } from '~core/shared_state';

export const DrawToolsToolbox = () => {
  const [activeDrawMode, { setDrawMode, toggleDrawMode }] = useAtom(activeDrawModeAtom);
  const [selected] = useAtom(selectedIndexesAtom)
  const [, { removeByIndexes }] = useAtom(drawnGeometryAtom)
  const [, { disable: disableSideIcon }] = useAtom(sideControlsBarAtom)
  useAtom(modeWatcherAtom);

  const [hintShown, setHintShown] = useState(
    window.localStorage.getItem(CLOSE_DRAW_HINT) !== 'true',
  )

  const onClick = useCallback(
    (modeId: string) => {
      const mode: DrawModeType = drawModes[modeId] || drawModes.ModifyMode;
      toggleDrawMode(mode);
    },
    [toggleDrawMode],
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

  const closeHint = useCallback(
    () => {
      setHintShown(false)
      window.localStorage.setItem(CLOSE_DRAW_HINT, 'true');
    },
    [setHintShown],
  );


  return activeDrawMode ? (
    <div>
      {hintShown && <div className={s.drawHint} onClick={closeHint}>
        <Text type="caption">
          <span className={s.drawHintText}>{i18n.t('Click on the map to begin drawing')}</span>
        </Text>
      </div>}

      <div className={s.drawToolsContainer}>
        <Button className={s.modeBtn} active={activeDrawMode === drawModes.DrawPolygonMode} onClick={() => onClick(drawModes.DrawPolygonMode)}>
          <div className={s.btnContent}>
            <DrawPolygonIcon /> {i18n.t('Area')}
          </div>
        </Button>
        <Button className={s.modeBtn} active={activeDrawMode === drawModes.DrawLineMode} onClick={() => onClick(drawModes.DrawLineMode)}>
          <div className={s.btnContent}>
            <DrawLineIcon /> {i18n.t('Line')}
          </div>
        </Button>
        <Button className={s.modeBtn}  active={activeDrawMode === drawModes.DrawPointMode} onClick={() => onClick(drawModes.DrawPointMode)}>
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
