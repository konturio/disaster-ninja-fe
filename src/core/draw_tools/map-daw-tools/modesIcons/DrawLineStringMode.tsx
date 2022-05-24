import { memo } from 'react';

const DrawLineStringMode = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <line
      x1="3.41421"
      y1="4"
      x2="20"
      y2="20.5858"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

DrawLineStringMode.displayName = 'DrawLineStringMode';

export default DrawLineStringMode;
