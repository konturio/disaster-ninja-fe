import { TranslationService as i18n } from '~core/localization';
import { Panel, PanelIcon, Text } from '@k2-packages/ui-kit';
import { LayersTree } from '../LayersTree/LayersTree';
import s from './MapLayersPanel.module.css';
import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { LayersPanelIcon } from '@k2-packages/default-icons';

export function MapLayerPanel({ iconsContainerId }: { iconsContainerId: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [childIconContainer, setChildIconContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const iconsContainer = document.getElementById(iconsContainerId);
    if (iconsContainer !== null) {
      const cont = iconsContainer.appendChild(document.createElement('div'));
      setChildIconContainer(cont);
      cont.className = s.iconContainerHidden;
    }
  }, []);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
    if (childIconContainer) {
      childIconContainer.className = s.iconContainerShown;
    }
  }, [setIsOpen, childIconContainer]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
    if (childIconContainer) {
      childIconContainer.className = s.iconContainerHidden;
    }
  }, [setIsOpen, childIconContainer]);

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
      {childIconContainer &&
      ReactDOM.createPortal(
        <PanelIcon
          clickHandler={onPanelOpen}
          className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
          icon={<LayersPanelIcon />}
        />,
        childIconContainer
      )
      }
    </>
  );
}
