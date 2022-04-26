import { Button, Text } from '@k2-packages/ui-kit';
import { useCallback, useMemo } from 'react';
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
import DownloadIcon from '~core/draw_tools/icons/DownloadIcon';

export const DrawToolsToolbox = () => {
  const [
    { mode: activeDrawMode, selectedIndexes, drawingIsStarted, settings },
    { deleteFeatures, toggleDrawMode, finishDrawing, downloadDrawGeometry },
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

  const onFinishClick = useCallback(() => {
    (async () => {
      if (settings.finishButtonCallback) {
        await settings.finishButtonCallback();
      }
      finishDrawing();
    })();
  }, [finishDrawing, settings]);

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
        {settings.availableModes?.includes('DrawPolygonMode') && (
          <Button
            className={s.modeBtn}
            active={activeDrawMode === drawModes.DrawPolygonMode}
            onClick={onPolygonClick}
          >
            <div className={s.btnContent}>
              <DrawPolygonIcon /> {i18n.t('Area')}
            </div>
          </Button>
        )}
        {settings.availableModes?.includes('DrawLineMode') && (
          <Button
            className={s.modeBtn}
            active={activeDrawMode === drawModes.DrawLineMode}
            onClick={onLineClick}
          >
            <div className={s.btnContent}>
              <DrawLineIcon /> {i18n.t('Line')}
            </div>
          </Button>
        )}
        {settings.availableModes?.includes('DrawPointMode') && (
          <Button
            className={s.modeBtn}
            active={activeDrawMode === drawModes.DrawPointMode}
            onClick={onPointClick}
          >
            <div className={s.btnContent}>
              <DrawPointIcon /> {i18n.t('Point')}
            </div>
          </Button>
        )}
        <Button
          className={s.modeBtn}
          disabled={!Boolean(selectedIndexes.length)}
          onClick={deleteFeatures}
        >
          <div className={s.btnContent}>
            <TrashBinIcon />
          </div>
        </Button>
        <Button className={s.modeBtn} onClick={downloadDrawGeometry}>
          <div className={s.btnContent}>
            <DownloadIcon />
          </div>
        </Button>
        <Button className={s.finishBtn} onClick={onFinishClick}>
          <div className={clsx(s.btnContent)}>
            {settings.finishButtonText || i18n.t('Finish Drawing')}
          </div>
        </Button>
      </div>
    </div>
  ) : null;
};
