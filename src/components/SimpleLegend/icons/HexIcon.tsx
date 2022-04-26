import { useMemo } from 'react';
import { LegendStepStyle, LegendIconSize } from '~core/types';
const sizes = {
  normal: 16,
  small: 12,
};

export function HexIcon({
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
  const casing = useMemo(
    () => Boolean(styles['casing-width'] || styles['casing-color']),
    [styles],
  );
  const opacity = useMemo(
    () =>
      styles['casing-opacity'] === undefined ? 1 : styles['casing-opacity'],
    [styles],
  );

  const casingPath = useMemo(() => {
    const offset = Number(styles['casing-offset']);
    if (offset === Number('0'))
      return 'M2.70577 5.36603L9 1.73205L15.2942 5.36602V12.634L9 16.268L2.70577 12.634V5.36603Z';
    if (offset === Number('1'))
      return 'M4.43782 6.36603L9 3.73205L13.5622 6.36603V11.634L9 14.2679L4.43782 11.634V6.36603Z';
    if (offset === Number('2'))
      return 'M5.30385 6.86603L9 4.73205L12.6962 6.86603V11.134L9 13.2679L5.30385 11.134V6.86603Z';
    if (offset === Number('3'))
      return 'M6.16987 7.36603L9 5.73205L11.8301 7.36603V10.634L9 12.2679L6.16987 10.634V7.36603Z';
    return 'M2.70577 5.36603L9 1.73205L15.2942 5.36602V12.634L9 16.268L2.70577 12.634V5.36603Z';
  }, [styles]);

  return (
    <svg
      width={sizes[size]}
      height={sizes[size]}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <path
        d="M2.70577 5.36603L9 1.73205L15.2942 5.36602V12.634L9 16.268L2.70577 12.634V5.36603Z"
        fill={fill || styles['fill-color'] || 'white'}
        stroke={fill || styles['fill-color'] || 'white'}
        strokeWidth="3"
      />

      {/* Outer figure - border representation*/}
      <path
        d="M2.70577 5.36603L9 1.73205L15.2942 5.36602V12.634L9 16.268L2.70577 12.634V5.36603Z"
        stroke={stroke || styles.color || '#000000'}
        strokeWidth={styles.width || 3}
      />

      {casing && (
        <g>
          {/* Casing background that prevents it from blending with outer figure - border */}
          <path
            d={casingPath}
            stroke={fill || styles['fill-color'] || 'white'}
            strokeWidth={fill || styles['casing-width'] || 3}
          />
          {/* Casing itself */}
          <path
            d={casingPath}
            stroke={fill || styles['casing-color'] || '#000000'}
            strokeWidth={fill || styles['casing-width'] || 3}
            style={{ opacity }}
          />
        </g>
      )}

      {/* Background / inner space */}
      <path
        d="M9 6L11.5981 7.5V10.5L9 12L6.40192 10.5V7.5L9 6Z"
        fill={fill || styles['fill-color'] || 'white'}
      />
    </svg>
  );
}
