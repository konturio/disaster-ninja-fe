import { Button, ButtonGroup, Text } from '@konturio/ui-kit';
import { useCallback } from 'react';
import {
  Line24,
  PointOutline24,
  Area24,
  Trash24,
} from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { Download24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { drawModes } from '../../constants';
import { combinedAtom } from '../../atoms/combinedAtom';
import { toolboxAtom } from '../../atoms/toolboxAtom';
import s from './DrawToolToolbox.module.css';
import type { DrawModeType } from '../../constants';

export const DrawToolsToolbox = () => {
  const [
    { mode: activeDrawMode, selectedIndexes, drawingIsStarted, settings },
    { deleteFeatures, toggleDrawMode, finishDrawing, downloadDrawGeometry },
  ] = useAtom(toolboxAtom);
  useAtom(combinedAtom);

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

      <ButtonGroup
        onChange={(id) => toggleDrawMode(id as DrawModeType)}
        current={activeDrawMode}
        classes={{ groupContainer: s.toolBox, btnContainer: s.toolBoxBtn }}
        borderWrap={false}
      >
        {settings.availableModes?.includes('DrawPolygonMode') && (
          <Button id={drawModes.DrawPolygonMode} dark variant="invert">
            <div className={s.btnContent}>
              <Area24 /> {i18n.t('Area')}
            </div>
          </Button>
        )}
        {settings.availableModes?.includes('DrawLineMode') && (
          <Button id={drawModes.DrawLineMode} dark variant="invert">
            <div className={s.btnContent}>
              <Line24 /> {i18n.t('Line')}
            </div>
          </Button>
        )}
        {settings.availableModes?.includes('DrawPointMode') && (
          <Button id={drawModes.DrawPointMode} dark variant="invert">
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
      </ButtonGroup>
    </div>
  ) : null;
};
