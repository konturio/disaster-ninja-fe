import { TranslationService as i18n } from '~core/localization';
import { Panel, PanelIcon, Text } from '@k2-packages/ui-kit';
import { LayersTree } from '../LayersTree/LayersTree';
import s from './MapLayersPanel.module.css';
import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { Layers24 } from '@k2-packages/default-icons';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';

export function MapLayerPanel({
  iconsContainerRef,
}: {
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <>
      <Panel
        className={clsx(s.panel, isOpen && s.show, !isOpen && s.hide)}
        header={<Text type="heading-l">{i18n.t('Layers')}</Text>}
        onClose={onPanelClose}
      >
        <div className={s.scrollable}>
          <LayersTree />
        </div>
      </Panel>
      {iconsContainerRef.current &&
        ReactDOM.createPortal(
          <div
            className={!isOpen ? s.iconContainerShown : s.iconContainerHidden}
          >
            <PanelIcon
              clickHandler={onPanelOpen}
              className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
              icon={<Layers24 />}
            />
          </div>,
          iconsContainerRef.current,
        )}
    </>
  );
}
