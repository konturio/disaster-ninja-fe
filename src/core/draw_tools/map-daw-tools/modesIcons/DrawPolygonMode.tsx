import { memo } from 'react';

const DrawPolygonMode = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      d="M15 10L3 3V21L9 18L21 21V4L15 10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
));

DrawPolygonMode.displayName = 'DrawPolygonMode';

export default DrawPolygonMode;
