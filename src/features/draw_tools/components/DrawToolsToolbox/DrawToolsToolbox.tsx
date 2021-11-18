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

export const DrawToolsToolbox = () => {
  const [activeDrawMode] = useAtom(activeDrawModeAtom);

  const onSelectTool = useCallback((modeId: string) => {
    console.log('on select btn');
  }, []);

  return activeDrawMode ? (
    <div className={s.drawToolsContainer}>
      <ButtonGroup
        onChange={onSelectTool}
        classes={{
          btnContainer: s.modeButton,
        }}
      >
        <Button id="button1">
          <div className={s.btnContainer}>
            <DrawPolygonIcon /> {i18n.t('Area')}
          </div>
        </Button>
        <Button id="button2">
          <div className={s.btnContainer}>
            <DrawLineIcon /> {i18n.t('Line')}
          </div>
        </Button>
        <Button id="button3">
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
      <Button className={s.finishBtn}>
        <div className={clsx(s.btnContainer)}>{i18n.t('Finish Drawing')}</div>
      </Button>
    </div>
  ) : null;
};
