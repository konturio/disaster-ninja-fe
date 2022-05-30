import { memo } from 'react';

const UploadMode = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      d="M3 17L3 20L21 20L21 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="transparent"
    />
    <path
      d="M13 16C13 16.5523 12.5523 17 12 17V17C11.4477 17 11 16.5523 11 16L11 6.5L13 6.5L13 16Z"
      fill="currentColor"
    />
    <path
      d="M15.4641 9.5L12 5L8.53589 9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

UploadMode.displayName = 'UploadMode';
export default UploadMode;
