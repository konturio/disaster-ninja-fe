import { memo } from 'react';

const SplitPolygonMode = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <line
      x1="12"
      y1="2"
      x2="12"
      y2="22"
      stroke="#FF0000"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
));

SplitPolygonMode.displayName = 'SplitPolygonMode';

export default SplitPolygonMode;
