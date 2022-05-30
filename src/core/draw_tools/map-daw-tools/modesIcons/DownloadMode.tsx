import { memo } from 'react';

const DownloadMode = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      d="M3 17L3 20H21V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="transparent"
    />
    <path
      d="M8.53589 11.5L12 16L15.4641 11.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 5C11 4.44771 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V15H11V5Z"
      fill="currentColor"
    />
  </svg>
));

DownloadMode.displayName = 'DownloadMode';

export default DownloadMode;
