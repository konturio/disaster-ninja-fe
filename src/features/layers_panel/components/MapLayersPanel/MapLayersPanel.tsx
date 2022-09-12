import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { Layers24 } from '@konturio/default-icons';
import { useAction } from '@reatom/react';
import { i18n } from '~core/localization';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import { PanelWrap } from '~components/Panel/Wrap/PanelWrap';
import { LayersTree } from '../LayersTree/LayersTree';
import s from './MapLayersPanel.module.css';

export function MapLayerPanel({
  iconsContainerRef,
}: {
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const turnOffTooltip = useAction(currentTooltipAtom.turnOffById);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
    turnOffTooltip(LAYERS_PANEL_FEATURE_ID);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <>
      <PanelWrap onPanelClose={onPanelClose} isPanelOpen={isOpen}>
        <Panel
          className={clsx(s.panel, isOpen && s.show, !isOpen && s.hide)}
          header={<Text type="heading-l">{i18n.t('layers')}</Text>}
          onClose={onPanelClose}
        >
          <div className={s.scrollable}>
            <LayersTree />
          </div>
        </Panel>
      </PanelWrap>

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
