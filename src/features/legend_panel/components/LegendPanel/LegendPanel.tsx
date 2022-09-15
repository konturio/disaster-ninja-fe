import { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { Legend24 } from '@konturio/default-icons';
import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { useAction } from '@reatom/react';
import { i18n } from '~core/localization';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { LEGEND_PANEL_FEATURE_ID } from '~features/legend_panel/constants';
import { PanelWrap } from '~components/Panel/Wrap/PanelWrap';
import { PanelHeader } from '~components/Panel/Header/Header';
import { PanelCloseButton } from '~components/Panel/CloseButton/CloseButton';
import s from './LegendPanel.module.css';
import { LegendsList } from './LegendsList';
import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';

interface LegendPanelProps {
  layers: LayerAtom[];
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const classes = { header: s.header };
export function LegendPanel({ layers, iconsContainerRef }: LegendPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const turnOffTooltip = useAction(currentTooltipAtom.turnOffById);

  const togglePanel = useCallback(() => {
    setIsOpen((wasOpen) => {
      if (wasOpen) turnOffTooltip(LEGEND_PANEL_FEATURE_ID);
      return !wasOpen;
    });
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <>
      <PanelWrap onPanelClose={() => setIsOpen(false)} isPanelOpen={isOpen}>
        <Panel
          header={<PanelHeader icon={<Legend24 />} title={i18n.t('legend')} />}
          onClose={togglePanel}
          className={clsx(s.legendPanel, isOpen && s.show, !isOpen && s.collapse)}
          classes={classes}
          customCloseBtn={<PanelCloseButton isOpen={isOpen} />}
        >
          <div className={s.panelBody}>
            {layers.map((layer) => (
              <LegendsList layer={layer} key={layer.id} />
            ))}
          </div>
        </Panel>
      </PanelWrap>

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
