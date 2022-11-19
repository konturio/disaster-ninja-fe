import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Legend24 } from '@konturio/default-icons';
import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useAction } from '@reatom/react';
import core from '~core/index';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { panelClasses } from '~components/Panel';
import {
  useAutoCollapsePanel,
  useSmartColumnContentResizer,
} from '~components/SmartColumn';
import { LEGEND_PANEL_FEATURE_ID, MIN_HEIGHT } from '../../constants';
import s from './LegendPanel.module.css';
import { LegendsList } from './LegendsList';
import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';

interface LegendPanelProps {
  layers: LayerAtom[];
}

export function LegendPanel({ layers }: LegendPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const turnOffTooltip = useAction(currentTooltipAtom.turnOffById);
  const contentRef = useSmartColumnContentResizer(setIsOpen, isOpen, MIN_HEIGHT);

  const togglePanel = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (!isOpen) turnOffTooltip(LEGEND_PANEL_FEATURE_ID);
  }, [isOpen, turnOffTooltip]);

  useAutoCollapsePanel(isOpen, onPanelClose);

  return (
    <div className={clsx(s.panelContainer, isOpen && s.open)}>
      <Panel
        header={core.i18n.t('legend')}
        headerIcon={<Legend24 />}
        onHeaderClick={togglePanel}
        className={clsx(s.legendPanel, isOpen ? s.show : s.collapse)}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{
          onModalClick: onPanelClose,
          showInModal: isMobile,
        }}
        minContentHeightPx={MIN_HEIGHT}
        resize={isMobile ? 'none' : 'vertical'}
        contentContainerRef={contentRef}
        contentClassName={s.content}
      >
        <div className={s.scrollable}>
          {layers.map((layer) => (
            <LegendsList layer={layer} key={layer.id} />
          ))}
        </div>
      </Panel>

      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={<Legend24 />}
      />
    </div>
  );
}
