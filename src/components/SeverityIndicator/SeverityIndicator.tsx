import { Tooltip } from '@konturio/ui-kit';
import { memo, useRef, useState } from 'react';
import { i18n } from '~core/localization';
import s from './SeverityIndicator.module.css';
import type { Severity } from '~core/types';

const COLORS = ['#FFDF35', '#FFB800', '#FF8A00', '#FF3D00', '#EA2A00'];

const severityToText = (severity: Severity) => {
  const translations = {
    UNKNOWN: i18n.t('event_list.severity_unknown'),
    TERMINATION: i18n.t('event_list.severity_termination'),
    MINOR: i18n.t('event_list.severity_minor'),
    MODERATE: i18n.t('event_list.severity_moderate'),
    SEVERE: i18n.t('event_list.severity_severe'),
    EXTREME: i18n.t('event_list.severity_extreme'),
  };

  return translations[severity];
};

function SeverityIndicatorGenerator({ severity }: { severity: Severity }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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
    <>
      <div
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={s.indicator}
      >
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
      <Tooltip placement="bottom" triggerRef={ref} hoverBehavior open={isHovered}>
        {severityToText(severity)}
      </Tooltip>
    </>
  );
}

export const SeverityIndicator = memo(SeverityIndicatorGenerator);
