import { Button, ButtonGroup, Text } from '@konturio/ui-kit';
import { useCallback, useMemo } from 'react';
import { Line24, PointOutline24, Area24, Trash24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { Download24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { drawModes } from '../../constants';
import { combinedAtom } from '../../atoms/combinedAtom';
import { toolboxAtom } from '../../atoms/toolboxAtom';
import s from './DrawToolToolbox.module.css';

const btnGroupClasses = {
  groupContainer: s.toolBox,
  btnContainer: s.toolBoxBtn,
};

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const buttons = useMemo(
    () => [
      settings.availableModes?.includes('DrawPolygonMode') && (
        <Button
          id={drawModes.DrawPolygonMode}
          key={drawModes.DrawPolygonMode}
          dark
          variant="invert"
          onClick={() => toggleDrawMode(drawModes.DrawPolygonMode)}
        >
          <div className={s.btnContent}>
            <Area24 />
            <span className={s.btnText}>{i18n.t('draw_tools.area')}</span>
          </div>
        </Button>
      ),
      settings.availableModes?.includes('DrawLineMode') && (
        <Button
          id={drawModes.DrawLineMode}
          key={drawModes.DrawLineMode}
          dark
          variant="invert"
          onClick={() => toggleDrawMode(drawModes.DrawLineMode)}
        >
          <div className={s.btnContent}>
            <Line24 />
            <span className={s.btnText}>{i18n.t('draw_tools.line')}</span>
          </div>
        </Button>
      ),
      settings.availableModes?.includes('DrawPointMode') && (
        <Button
          id={drawModes.DrawPointMode}
          key={drawModes.DrawPointMode}
          dark
          variant="invert"
          onClick={() => toggleDrawMode(drawModes.DrawPointMode)}
        >
          <div className={s.btnContent}>
            <PointOutline24 />
            <span className={s.btnText}>{i18n.t('draw_tools.point')}</span>
          </div>
        </Button>
      ),
      <Button
        key="delete"
        dark
        variant="invert"
        disabled={!Boolean(selectedIndexes.length)}
        onClick={deleteFeatures}
      >
        <Trash24 />
      </Button>,
      <Button key="download" dark variant="invert" onClick={downloadDrawGeometry}>
        <Download24 />
      </Button>,
      <Button key="finish" onClick={onFinishClick}>
        {settings.finishButtonText || i18n.t('draw_tools.finish_drawing')}
      </Button>,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIndexes.length, settings, onFinishClick],
  );

  return activeDrawMode ? (
    <div className={s.drawToolsContainer}>
      {/* This logic and elements might reapper on draw tools refactor so i'm keeping them */}
      {/* {!drawingIsStarted && (
        <div className={s.drawHint}>
          <Text type="caption">
            <span>{i18n.t('draw_tools.caption')}</span>
          </Text>
        </div>
      )} */}

      <div className={s.bGroupWrap}>
        <ButtonGroup
          current={activeDrawMode}
          classes={btnGroupClasses}
          borderWrap={false}
        >
          {buttons}
        </ButtonGroup>
      </div>
    </div>
  ) : null;
};
