import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { Layers24 } from '@konturio/default-icons';
import { useAction } from '@reatom/react';
import { i18n } from '~core/localization';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import { panelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { LayersTree } from '../LayersTree/LayersTree';
import s from './MapLayersPanel.module.css';

export function MapLayerPanel({
  iconsContainerRef,
}: {
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const turnOffTooltip = useAction(currentTooltipAtom.turnOffById);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const togglePanel = useCallback(() => {
    setIsOpen((prevState) => !prevState);
    turnOffTooltip(LAYERS_PANEL_FEATURE_ID);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useAutoCollapsePanel(isOpen, onPanelClose);

  return (
    <>
      <Panel
        header={String(i18n.t('layers'))}
        headerIcon={<Layers24 />}
        onHeaderClick={togglePanel}
        className={clsx(s.panel, isOpen ? s.show : s.collapse)}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{
          onModalClick: onPanelClose,
          showInModal: isMobile,
        }}
      >
        <div className={s.scrollable}>
          <LayersTree />
        </div>
      </Panel>

      {iconsContainerRef.current &&
        ReactDOM.createPortal(
          <div className={!isOpen ? s.iconContainerShown : s.iconContainerHidden}>
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
