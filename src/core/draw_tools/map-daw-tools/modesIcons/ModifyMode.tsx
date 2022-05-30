import { memo } from 'react';

const ModifyMode = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      d="M17.6569 14.8284C18.4379 15.6095 18.4379 16.8758 17.6569 17.6569C16.8758 18.4379 15.6095 18.4379 14.8284 17.6569L4.58579 7.41421C3.80474 6.63317 3.80474 5.36683 4.58579 4.58579C5.04613 4.12544 5.67424 3.93572 6.27631 4.01901C6.69277 4.07662 7.09315 4.26473 7.41421 4.58579L17.6569 14.8284Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M19.2481 19.4313L17.0422 18.6488L18.6046 17.2116L19.2481 19.4313Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="6" r="3" fill="currentColor" />
  </svg>
));

ModifyMode.displayName = 'ModifyMode';

export default ModifyMode;
