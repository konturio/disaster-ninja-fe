import { TranslationService as i18n } from '~core/localization';
import { Panel, Text } from '@k2-packages/ui-kit';
import s from './LegendPanel.module.css';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { LayerLegend } from '~utils/atoms/createLogicalLayerAtom';
import { Legend as BivariateLegend } from '@k2-packages/ui-kit';
import { invertClusters } from '@k2-packages/bivariate-tools';

interface CopyrightsProps {
  copyrights: string[];
}

const Copyrights = ({ copyrights }: CopyrightsProps) => {
  return copyrights.length ? (
    <div className={s.copyrightsContainer}>
      {copyrights.map((cp) => (
        <div className={s.copyright}>{cp}</div>
      ))}
    </div>
  ) : null;
};

interface LegendPanelProps {
  legends: LayerLegend[];
}

export function LegendPanel({ legends }: LegendPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (legends.length && !isOpen) {
      setIsOpen(true);
    } else if (!legends.length && isOpen) {
      setIsOpen(false);
    }
  }, [legends]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <div className={s.panelContainer}>
      <Panel
        header={<Text type="heading-l">{i18n.t('Legend')}</Text>}
        onClose={onPanelClose}
        className={clsx(s.sidePannel, isOpen && s.show, !isOpen && s.hide)}
        classes={{
          header: s.header,
        }}
      >
        <div className={s.panelBody}>
          {legends.map((lg) => {
            if (lg.type === 'bivariate')
              return (
                <div key={lg.name} className={s.bivariateLegend}>
                  <BivariateLegend
                    showAxisLabels
                    size={3}
                    cells={invertClusters(lg.steps, 'label')}
                    axis={lg.axis as any}
                    title={lg.name}
                  />
                  <Copyrights copyrights={lg.copyrights} />
                </div>
              );
          })}
        </div>
      </Panel>
    </div>
  );
}
