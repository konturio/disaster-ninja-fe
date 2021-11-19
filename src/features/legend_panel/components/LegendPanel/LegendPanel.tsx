import { TranslationService as i18n } from '~core/localization';
import { Panel, Text } from '@k2-packages/ui-kit';
import s from './LegendPanel.module.css';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { LayerLegend } from '~utils/atoms/createLogicalLayerAtom';
import { Legend as BivariateLegend } from '@k2-packages/ui-kit';
import { invertClusters } from '@k2-packages/bivariate-tools';
import { Tooltip } from '~components/Tooltip/Tooltip';

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
            if (lg.type === 'bivariate') {
              let tipText = '';
              if (lg.description) {
                tipText = lg.description;
              }
              if (lg.copyrights && lg.copyrights.length) {
                if (tipText) {
                  tipText += '\n';
                }
                lg.copyrights.forEach((cp, index) => {
                  if (index) {
                    tipText += '\n';
                  }
                  tipText += cp;
                });
              }
              return (
                <div key={lg.name} className={s.bivariateLegend}>
                  <Tooltip className={s.tooltip} tipText={tipText} />
                  <BivariateLegend
                    showAxisLabels
                    size={3}
                    cells={invertClusters(lg.steps, 'label')}
                    axis={lg.axis as any}
                    title={lg.name}
                  />
                </div>
              );
            }
          })}
        </div>
      </Panel>
    </div>
  );
}
