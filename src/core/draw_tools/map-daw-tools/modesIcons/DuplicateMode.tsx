import { memo } from 'react';

const DuplicateMode = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <rect
      x="3"
      y="7"
      width="14"
      height="14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <rect
      x="7"
      y="3"
      width="14"
      height="14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
));

DuplicateMode.displayName = 'DuplicateMode';

export default DuplicateMode;
