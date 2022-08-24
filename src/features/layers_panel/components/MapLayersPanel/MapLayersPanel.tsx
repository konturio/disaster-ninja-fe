import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { Layers24 } from '@konturio/default-icons';
import { useAction } from '@reatom/react';
import { i18n } from '~core/localization';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import { LayersTree } from '../LayersTree/LayersTree';
import s from './MapLayersPanel.module.css';

export function MapLayerPanel({
  iconsContainerRef,
}: {
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const turnOffTooltip = useAction(currentTooltipAtom.turnOffById);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
      turnOffTooltip(LAYERS_PANEL_FEATURE_ID);
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
        header={<Text type="heading-l">{i18n.t('layers')}</Text>}
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
