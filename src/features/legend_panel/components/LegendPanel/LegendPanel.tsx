import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { LegendPanelIcon } from '@k2-packages/default-icons';
import { Panel, PanelIcon, Text } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import s from './LegendPanel.module.css';
import { LegendsList } from './LegendsList';

import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import { AsyncState } from '~core/logical_layers/types/asyncState';

interface LegendPanelProps {
  layers: LayerAtom[];
  iconsContainerId: string;
}

export function LegendPanel({ layers, iconsContainerId }: LegendPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [closed, setClosedPreferation] = useState<boolean>(false);
  const [childIconContainer, setChildIconContainer] =
    useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const iconsContainer = document.getElementById(iconsContainerId);
    if (iconsContainer !== null) {
      setChildIconContainer(
        iconsContainer.appendChild(document.createElement('div')),
      );
    }
  }, []);

  useEffect(() => {
    if (!closed && layers.length && !isOpen) {
      setIsOpen(true);
      if (childIconContainer) {
        childIconContainer.className = s.iconContainerHidden;
      }
    } else if (!layers.length && isOpen) {
      setIsOpen(false);
      if (childIconContainer) {
        childIconContainer.className = s.iconContainerShown;
      }
    }
  }, [layers]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
    setClosedPreferation(true);
    if (childIconContainer) {
      childIconContainer.className = s.iconContainerShown;
    }
  }, [setIsOpen, childIconContainer]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
    setClosedPreferation(false);
    if (childIconContainer) {
      childIconContainer.className = s.iconContainerHidden;
    }
  }, [setIsOpen, childIconContainer]);

  return (
    <>
      <Panel
        header={<Text type="heading-l">{i18n.t('Legend')}</Text>}
        onClose={onPanelClose}
        className={clsx(s.sidePannel, isOpen && s.show, !isOpen && s.hide)}
        classes={{
          header: s.header,
        }}
      >
        <div className={s.panelBody}>
          {layers.map((layer) => (
            <LegendsList layer={layer} key={layer.id} />
          ))}
        </div>
      </Panel>
      {childIconContainer &&
        ReactDOM.createPortal(
          <PanelIcon
            clickHandler={onPanelOpen}
            className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
            icon={<LegendPanelIcon />}
          />,
          childIconContainer,
        )}
    </>
  );
}
