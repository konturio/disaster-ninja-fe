import { TranslationService as i18n } from '~core/localization';
import { Panel, PanelIcon, Text } from '@k2-packages/ui-kit';
import s from './LegendPanel.module.css';
import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { LegendSorter } from './LegendSorter';
import { LegendPanelIcon } from '@k2-packages/default-icons';

interface LegendPanelProps {
  layersId: string[];
  iconsContainerId: string;
}

export function LegendPanel({ layersId, iconsContainerId }: LegendPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [closed, setClosedPreferation] = useState<boolean>(false);
  const [childIconContainer, setChildIconContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const iconsContainer = document.getElementById(iconsContainerId);
    if (iconsContainer !== null) {
      setChildIconContainer(iconsContainer.appendChild(document.createElement('div')))
    }
  }, []);

  useEffect(() => {
    if (!closed && layersId.length && !isOpen) {
      setIsOpen(true);
      if (childIconContainer) {
        childIconContainer.className = s.iconContainerHidden;
      }
    } else if (!layersId.length && isOpen) {
      setIsOpen(false);
      if (childIconContainer) {
        childIconContainer.className = s.iconContainerShown;
      }
    }
  }, [layersId]);

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
          {layersId.map((id) => (
            <LegendSorter id={id} key={id} />
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
          childIconContainer
        )
      }
    </>
  );
}
