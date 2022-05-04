import { memo } from 'react';
import s from './SeverityIndicator.module.css';

const COLORS = ['#FFDF35', '#FFB800', '#FF8A00', '#FF3D00', '#EA2A00'];

function SeverityIndicatorGenerator({
  severity,
}: {
  severity:
    | 'TERMINATION'
    | 'MINOR'
    | 'MODERATE'
    | 'SEVERE'
    | 'EXTREME'
    | 'UNKNOWN';
}) {
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
  );
}

export const SeverityIndicator = memo(SeverityIndicatorGenerator);
