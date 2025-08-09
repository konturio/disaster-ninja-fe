import type { LegendStepStyle, LegendIconSize } from '~core/types';
const sizes = {
  normal: 16,
  small: 12,
};

export function CircleIcon({
  styles,
  size,
  className,
  fill,
  stroke,
}: {
  styles: LegendStepStyle;
  size: LegendIconSize;
  className?: string;
  fill?: string;
  stroke?: string;
}) {
  const fillColor = fill || styles['fill-color'] || styles['circle-color'] || 'none';
  const strokeColor =
    stroke ||
    styles['circle-stroke-color'] ||
    styles.color ||
    styles['circle-color'] ||
    '#000000';

  return (
    <svg
      width={sizes[size]}
      height={sizes[size]}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {fillColor === 'none' ? (
        <line
          x1="2"
          y1="9"
          x2="16"
          y2="9"
          stroke={strokeColor}
          strokeWidth={styles.width ?? 4}
        />
      ) : (
        <circle
          cx="9"
          cy="9"
          r="7"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={styles.width ?? 4}
        />
      )}
    </svg>
  );
}
