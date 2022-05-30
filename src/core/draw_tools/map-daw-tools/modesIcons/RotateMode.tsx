import { memo } from 'react';

const RotateMode = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      d="M15.5393 19.1765C14.4723 19.7037 13.2707 20 12 20C7.58172 20 4 16.4182 4 12C4 10.7292 4.29627 9.52772 4.82351 8.46069"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M19.1765 15.5393C19.7037 14.4723 20 13.2707 20 12C20 7.58172 16.4183 4 12 4C10.7293 4 9.52772 4.29628 8.46069 4.82352"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M7.7791 13.332L6.53759 6.4064L0.378799 9.66838L7.7791 13.332Z"
      fill="currentColor"
    />
    <path
      d="M16.956 10.2998L17.0721 17.3348L23.6739 15.1015L16.956 10.2998Z"
      fill="currentColor"
    />
  </svg>
));

RotateMode.displayName = 'RotateMode';

export default RotateMode;
