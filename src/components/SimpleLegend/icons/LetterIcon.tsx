import type { LegendIconSize } from '~core/types';

const sizes = {
  normal: 16,
  small: 12,
};

export function LetterIcon({
  letter,
  color,
  size,
  className,
}: {
  letter: string;
  color: string;
  size: LegendIconSize;
  className?: string;
}) {
  return (
    <svg
      width={sizes[size]}
      height={sizes[size]}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="9"
        y="13"
        textAnchor="middle"
        fontSize={sizes[size] - 2}
        fontWeight="bold"
        fill={color}
      >
        {letter}
      </text>
    </svg>
  );
}
