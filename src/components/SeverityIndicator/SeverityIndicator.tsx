import { memo } from 'react';
import { SimpleTooltip } from '@konturio/floating';
import { i18n } from '~core/localization';
import s from './SeverityIndicator.module.css';
import type { Severity } from '~core/types';

const COLORS = ['#FFDF35', '#FFB800', '#FF8A00', '#FF3D00', '#EA2A00'];

const severityToText = (severity: Severity) => {
  switch (severity) {
    case 'UNKNOWN':
      return i18n.t('event_list.severity_unknown');
    case 'TERMINATION':
      return i18n.t('event_list.severity_termination');
    case 'MINOR':
      return i18n.t('event_list.severity_minor');
    case 'MODERATE':
      return i18n.t('event_list.severity_moderate');
    case 'SEVERE':
      return i18n.t('event_list.severity_severe');
    case 'EXTREME':
      return i18n.t('event_list.severity_extreme');
  }
};

function SeverityIndicatorGenerator({ severity }: { severity: Severity }) {
  // index after what all cells must be be gray
  const pivot = {
    UNKNOWN: 0,
    TERMINATION: 1,
    MINOR: 2,
    MODERATE: 3,
    SEVERE: 4,
    EXTREME: 5,
  }[severity];

  return (
    <SimpleTooltip content={severityToText(severity)}>
      <div className={s.indicator}>
        {Array.from(new Array(5)).map((_, i) => (
          <div
            key={i}
            className={s.indicatorCell}
            style={{
              backgroundColor: i < pivot ? COLORS[i] : 'var(--faint-weak)',
            }}
          ></div>
        ))}
      </div>
    </SimpleTooltip>
  );
}

export const SeverityIndicator = memo(SeverityIndicatorGenerator);
