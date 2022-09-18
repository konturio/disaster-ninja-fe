import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { Legend24 } from '@konturio/default-icons';
import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useAction } from '@reatom/react';
import { i18n } from '~core/localization';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { LEGEND_PANEL_FEATURE_ID } from '~features/legend_panel/constants';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { panelClasses } from '~components/Panel';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import s from './LegendPanel.module.css';
import { LegendsList } from './LegendsList';
import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';

interface LegendPanelProps {
  layers: LayerAtom[];
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export function LegendPanel({ layers, iconsContainerRef }: LegendPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const turnOffTooltip = useAction(currentTooltipAtom.turnOffById);

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
  }, [isOpen]);

  useAutoCollapsePanel(isOpen, onPanelClose);

  return (
    <>
      <Panel
        header={String(i18n.t('legend'))}
        headerIcon={<Legend24 />}
        onHeaderClick={togglePanel}
        className={clsx(s.legendPanel, isOpen ? s.show : s.collapse)}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{
          onModalClick: onPanelClose,
          showInModal: isMobile,
        }}
      >
        <div className={s.panelBody}>
          {layers.map((layer) => (
            <LegendsList layer={layer} key={layer.id} />
          ))}
        </div>
      </Panel>

      {iconsContainerRef.current &&
        ReactDOM.createPortal(
          <PanelIcon
            clickHandler={onPanelOpen}
            className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
            icon={<Legend24 />}
          />,
          iconsContainerRef.current,
        )}
    </>
  );
}
