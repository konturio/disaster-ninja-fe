import { TranslationService as i18n } from '~core/localization';
import { Panel, PanelIcon, Text } from '@k2-packages/ui-kit';
import s from './LegendPanel.module.css';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import infoIcon from '~features/legend_panel/icons/info_icon.svg';
import { LegendSorter } from './LegendSorter';

interface LegendPanelProps {
  layersId: string[];
}

export function LegendPanel({ layersId }: LegendPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [closed, setClosedPreferation] = useState<boolean>(false);

  useEffect(() => {
    if (!closed && layersId.length && !isOpen) {
      setIsOpen(true);
    } else if (!layersId.length && isOpen) {
      setIsOpen(false);
    }
  }, [layersId]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
    setClosedPreferation(true);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
    setClosedPreferation(false);
  }, [setIsOpen]);

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
          {layersId
            .filter((l) => l !== 'boundary-selector')
            .map((id) => (
              <LegendSorter id={id} key={id} />
            ))}
        </div>
      </Panel>

      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={
          <img
            src={infoIcon}
            alt={i18n.t('Open legends panel')}
            className={s.iconElement}
          />
        }
      />
    </>
  );
}
