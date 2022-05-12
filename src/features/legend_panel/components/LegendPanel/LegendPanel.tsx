import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { LegendPanelIcon } from '@k2-packages/default-icons';
import { Panel, PanelIcon, Text } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import s from './LegendPanel.module.css';
import { LegendsList } from './LegendsList';

import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';

interface LegendPanelProps {
  layers: LayerAtom[];
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export function LegendPanel({ layers, iconsContainerRef }: LegendPanelProps) {
  // isOpen - is an overall state of panel. Was closed stores wether the panel was closed by user -> preferred to be closed
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [wasClosed, setWasClosed] = useState<boolean>(false);

  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (layers.length && !isMobile && !wasClosed && !isOpen) {
      setIsOpen(true);
    } else if (!layers.length && isOpen) {
      setIsOpen(false);
    }
  }, [layers]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
    setWasClosed(true);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
    setWasClosed(false);
  }, [setIsOpen]);

  return (
    <>
      <Panel
        header={<Text type="heading-l">{i18n.t('Legend')}</Text>}
        onClose={onPanelClose}
        className={clsx(s.sidePanel, isOpen && s.show, !isOpen && s.hide)}
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
      {iconsContainerRef.current &&
        ReactDOM.createPortal(
          <PanelIcon
            clickHandler={onPanelOpen}
            className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
            icon={<LegendPanelIcon />}
          />,
          iconsContainerRef.current,
        )}
    </>
  );
}
