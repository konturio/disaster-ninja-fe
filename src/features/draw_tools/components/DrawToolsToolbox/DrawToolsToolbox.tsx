import { Button, ButtonGroup } from '@k2-packages/ui-kit';
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
import { drawModes, DrawModeType } from '~features/draw_tools/constants';
import { modeWatcherAtom } from '~features/draw_tools/atoms/drawLayerAtom';

export const DrawToolsToolbox = () => {
  const [activeDrawMode, { setDrawMode }] = useAtom(activeDrawModeAtom);
  useAtom(modeWatcherAtom);

  const onSelectTool = useCallback(
    (modeId: string) => {
      const mode: DrawModeType = drawModes[modeId] || drawModes.ModifyMode;
      setDrawMode(mode);
    },
    [setDrawMode],
  );

  const finishDrawing = useCallback(
    () => {
      setDrawMode(undefined);
    },
    [setDrawMode],
  );

  return activeDrawMode ? (
    <div className={s.drawToolsContainer}>
      <ButtonGroup
        onChange={onSelectTool}
        classes={{
          btnContainer: s.modeButton,
        }}
      >
        <Button id={drawModes.DrawPolygonMode}>
          <div className={s.btnContainer}>
            <DrawPolygonIcon /> {i18n.t('Area')}
          </div>
        </Button>
        <Button id={drawModes.DrawLineMode}>
          <div className={s.btnContainer}>
            <DrawLineIcon /> {i18n.t('Line')}
          </div>
        </Button>
        <Button id={drawModes.DrawPointMode}>
          <div className={s.btnContainer}>
            <DrawPointIcon /> {i18n.t('Point')}
          </div>
        </Button>
      </ButtonGroup>
      <Button>
        <div className={s.btnContainer}>
          <TrashBinIcon />
        </div>
      </Button>
      {/* this is temporary  */}
      <Button className={s.finishBtn} onClick={() => finishDrawing()}>
        <div className={clsx(s.btnContainer)}>{i18n.t('Finish Drawing')}</div>
      </Button>
    </div>
  ) : null;
};
