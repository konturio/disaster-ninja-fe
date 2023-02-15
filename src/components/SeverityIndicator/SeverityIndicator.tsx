import { Tooltip } from '@konturio/ui-kit';
import { memo, useRef, useState } from 'react';
import { i18n } from '~core/localization';
import s from './SeverityIndicator.module.css';

const COLORS = ['#FFDF35', '#FFB800', '#FF8A00', '#FF3D00', '#EA2A00'];

const SEVERITY_TO_TEXT = {
  UNKNOWN: i18n.t('common.severity_unknown'),
  TERMINATION: i18n.t('common.severity_termination'),
  MINOR: i18n.t('common.severity_minor'),
  MODERATE: i18n.t('common.severity_moderate'),
  SEVERE: i18n.t('common.severity_severe'),
  EXTREME: i18n.t('common.severity_extreme'),
};

function SeverityIndicatorGenerator({
  severity,
}: {
  severity: 'TERMINATION' | 'MINOR' | 'MODERATE' | 'SEVERE' | 'EXTREME' | 'UNKNOWN';
}) {
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
        {SEVERITY_TO_TEXT[severity]}
      </Tooltip>
    </>
  );
}

export const SeverityIndicator = memo(SeverityIndicatorGenerator);
