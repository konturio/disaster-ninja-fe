import { Button, Text } from '@konturio/ui-kit';
import { useCallback, useMemo } from 'react';
import {
  Line24,
  PointOutline24,
  Area24,
  Trash24,
} from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import clsx from 'clsx';
import { Download24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { drawModes } from '../../constants';
import { combinedAtom } from '../../atoms/combinedAtom';
import { toolboxAtom } from '../../atoms/toolboxAtom';
import s from './DrawToolToolbox.module.css';

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
            dark
            variant="invert"
            active={activeDrawMode === drawModes.DrawPolygonMode}
            onClick={onPolygonClick}
          >
            <div className={s.btnContent}>
              <Area24 /> {i18n.t('Area')}
            </div>
          </Button>
        )}
        {settings.availableModes?.includes('DrawLineMode') && (
          <Button
            dark
            variant="invert"
            active={activeDrawMode === drawModes.DrawLineMode}
            onClick={onLineClick}
          >
            <div className={s.btnContent}>
              <Line24 /> {i18n.t('Line')}
            </div>
          </Button>
        )}
        {settings.availableModes?.includes('DrawPointMode') && (
          <Button
            dark
            variant="invert"
            active={activeDrawMode === drawModes.DrawPointMode}
            onClick={onPointClick}
          >
            <div className={s.btnContent}>
              <PointOutline24 /> {i18n.t('Point')}
            </div>
          </Button>
        )}
        <Button
          dark
          variant="invert"
          disabled={!Boolean(selectedIndexes.length)}
          onClick={deleteFeatures}
        >
          <Trash24 />
        </Button>
        <Button dark variant="invert" onClick={downloadDrawGeometry}>
          <Download24 />
        </Button>
        <Button onClick={onFinishClick}>
          {settings.finishButtonText || i18n.t('Finish Drawing')}
        </Button>
      </div>
    </div>
  ) : null;
};
