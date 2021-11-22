import { LegendStepStyle, LegendIconSize } from '~components/LegendPanel/types';
const sizes = {
  normal: 16,
  small: 12,
};

export function CircleIcon({
  styles,
  size,
}: {
  styles: LegendStepStyle;
  size: LegendIconSize;
}) {
  return (
    <svg
      width={sizes[size]}
      height={sizes[size]}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        fill={styles['fill-color'] || 'none'}
        stroke={styles.color || '#000000'}
        strokeWidth={styles.width || 4}
      />
    </svg>
  );
}
