import { memo } from 'react';
import { SimpleTooltip } from '@konturio/floating';
import clsx from 'clsx';
import { i18n } from '~core/localization';
import s from './Severity.module.css';
import type { Severity } from '~core/types';

const SEVERITY_CONFIG = {
  UNKNOWN: {
    level: 0,
    color: null,
    text: i18n.t('event_list.severity_unknown'),
  },
  TERMINATION: {
    level: 1,
    color: '#FFDF35',
    text: i18n.t('event_list.severity_termination'),
  },
  MINOR: {
    level: 2,
    color: '#FFB800',
    text: i18n.t('event_list.severity_minor'),
  },
  MODERATE: {
    level: 3,
    color: '#FF8A00',
    text: i18n.t('event_list.severity_moderate'),
  },
  SEVERE: {
    level: 4,
    color: '#FF3D00',
    text: i18n.t('event_list.severity_severe'),
  },
  EXTREME: {
    level: 5,
    color: '#EA2A00',
    text: i18n.t('event_list.severity_extreme'),
  },
} as const;

// Derived constants
const SEVERITY_LEVELS = Object.values(SEVERITY_CONFIG).filter(({ level }) => level > 0);
const COLORS = SEVERITY_LEVELS.map(({ color }) => color);

interface SeverityIndicatorProps {
  value: Severity;
  className?: string;
}

function SeverityIndicatorImpl({ value, className }: SeverityIndicatorProps) {
  if (!SEVERITY_CONFIG[value]) {
    return null; // Fallback to prevent rendering errors
  }
  const pivot = SEVERITY_CONFIG[value].level;
  const tooltip = SEVERITY_CONFIG[value].text;
  return (
    <SimpleTooltip content={tooltip} placement="top">
      <div className={clsx(s.indicator, className)}>
        {COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              backgroundColor: i < pivot ? (color ?? 'none') : '#eceeef',
            }}
          />
        ))}
      </div>
    </SimpleTooltip>
  );
}

export const SeverityIndicator = memo(SeverityIndicatorImpl);
