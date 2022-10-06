import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Layers24 } from '@konturio/default-icons';
import { useAction } from '@reatom/react';
import { i18n } from '~core/localization';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import { panelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { LayersTree } from '../LayersTree/LayersTree';
import s from './MapLayersPanel.module.css';

export function MapLayerPanel() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const turnOffTooltip = useAction(currentTooltipAtom.turnOffById);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const minHeight = 40;
  const handleRefChange = useHeightResizer(setIsOpen, isOpen, minHeight);

  const togglePanel = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, [setIsOpen]);

  useEffect(() => {
    !isOpen && turnOffTooltip(LAYERS_PANEL_FEATURE_ID);
  }, [isOpen, turnOffTooltip]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useAutoCollapsePanel(isOpen, onPanelClose);

  return (
    <div className={s.panelContainer}>
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
        minContentHeightPx={minHeight}
        resize={!isMobile ? 'vertical' : 'none'}
        contentContainerRef={handleRefChange}
      >
        <div className={s.scrollable}>
          <LayersTree />
        </div>
      </Panel>

      <div className={!isOpen ? s.iconContainerShown : s.iconContainerHidden}>
        <PanelIcon
          clickHandler={onPanelOpen}
          className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
          icon={<Layers24 />}
        />
      </div>
    </div>
  );
}
