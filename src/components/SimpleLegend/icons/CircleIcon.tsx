import { LegendStepStyle, LegendIconSize } from '~core/types';
const sizes = {
  normal: 16,
  small: 12,
};

export function CircleIcon({
  styles,
  size,
  className,
}: {
  styles: LegendStepStyle;
  size: LegendIconSize;
  className?: string;
}) {
  return (
    <svg
      width={sizes[size]}
      height={sizes[size]}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        fill={
          styles['fill-color'] ||
          styles['circle-color'] ||
          styles['text-color'] ||
          'none'
        }
        stroke={
          styles['circle-stroke-color'] ||
          styles.color ||
          styles['circle-color'] ||
          styles['text-color'] ||
          '#000000'
        }
        strokeWidth={styles.width || 4}
      />
    </svg>
  );
}
