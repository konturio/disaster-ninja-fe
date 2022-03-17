import { Button, Text } from '@k2-packages/ui-kit';
import { useCallback } from 'react';
import { TranslationService as i18n } from '~core/localization';
import {
  DrawLineIcon,
  DrawPointIcon,
  DrawPolygonIcon,
  TrashBinIcon,
} from '@k2-packages/default-icons';
import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import s from './DrawToolToolbox.module.css';
import { drawModes } from '../../constants';
import { combinedAtom } from '../../atoms/combinedAtom';
import { toolboxAtom } from '../../atoms/toolboxAtom';

export const DrawToolsToolbox = () => {
  const [
    { mode: activeDrawMode, selectedIndexes, drawingIsStarted },
    { deleteFeatures, toggleDrawMode, finishDrawing },
  ] = useAtom(toolboxAtom);
  useAtom(combinedAtom);

  const onPolygonClick = useCallback(() => {
    toggleDrawMode(drawModes.DrawPolygonMode);
  }, [toggleDrawMode]);

  const onLineClick = useCallback(() => {
    toggleDrawMode(drawModes.DrawLineMode);
  }, [toggleDrawMode]);

  const onPointClick = useCallback(() => {
    toggleDrawMode(drawModes.DrawPointMode);
  }, [toggleDrawMode]);

  const onDelete = useCallback(() => deleteFeatures(), [deleteFeatures]);

  return activeDrawMode ? (
    <div className={s.drawToolsContainer}>
      {!drawingIsStarted && (
        <div className={s.drawHint}>
          <Text type="caption">
            <span>{i18n.t('Click on the map to begin drawing')}</span>
          </Text>
        </div>
      )}

      <div className={s.toolBox}>
        <Button
          className={s.modeBtn}
          active={activeDrawMode === drawModes.DrawPolygonMode}
          onClick={onPolygonClick}
        >
          <div className={s.btnContent}>
            <DrawPolygonIcon /> {i18n.t('Area')}
          </div>
        </Button>
        <Button
          className={s.modeBtn}
          active={activeDrawMode === drawModes.DrawLineMode}
          onClick={onLineClick}
        >
          <div className={s.btnContent}>
            <DrawLineIcon /> {i18n.t('Line')}
          </div>
        </Button>
        <Button
          className={s.modeBtn}
          active={activeDrawMode === drawModes.DrawPointMode}
          onClick={onPointClick}
        >
          <div className={s.btnContent}>
            <DrawPointIcon /> {i18n.t('Point')}
          </div>
        </Button>
        <Button
          className={s.modeBtn}
          active={Boolean(selectedIndexes.length)}
          onClick={onDelete}
        >
          <div className={s.btnContent}>
            <TrashBinIcon />
          </div>
        </Button>
        {/* this is temporary  */}
        <Button className={s.finishBtn} onClick={finishDrawing}>
          <div className={clsx(s.btnContent)}>{i18n.t('Finish Drawing')}</div>
        </Button>
      </div>
    </div>
  ) : null;
};
