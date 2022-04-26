import { LegendStepStyle, LegendIconSize } from '~core/types';
const sizes = {
  normal: 16,
  small: 12,
};

export function SquareIcon({
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
  return (
    <svg
      width={sizes[size]}
      height={sizes[size]}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="3"
        y="3"
        width="12"
        height="12"
        fill={fill || styles['fill-color'] || 'none'}
        stroke={stroke || styles.color || '#000000'}
        strokeWidth={styles.width || 3}
      />
    </svg>
  );
}
