import { memo } from 'react';

const DrawEllipseByBoundingBoxMode = memo(
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path
        d="M18.799 18.799C17.5207 20.0773 15.5847 20.5827 13.3732 20.2272C11.1633 19.8719 8.76062 18.6601 6.73238 16.6319C4.70413 14.6036 3.49233 12.201 3.13707 9.99104C2.78156 7.77955 3.28697 5.84357 4.56526 4.56528C5.84356 3.28699 7.77954 2.78157 9.99103 3.13708C12.201 3.49234 14.6036 4.70415 16.6319 6.73239C18.6601 8.76063 19.8719 11.1633 20.2272 13.3732C20.5827 15.5847 20.0773 17.5207 18.799 18.799Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ),
);
DrawEllipseByBoundingBoxMode.displayName = 'DrawEllipseByBoundingBoxMode';

export default DrawEllipseByBoundingBoxMode;
