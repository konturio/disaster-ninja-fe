import { memo } from 'react';

const DrawRectangleUsingThreePointsMode = memo(
  (props: React.SVGProps<SVGSVGElement>) => (
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
      <circle cx="3.5" cy="3.5" r="2.5" fill="#FF0000" />
      <circle cx="3.5" cy="20.5" r="2.5" fill="#FF0000" />
      <circle cx="20.5" cy="20.5" r="2.5" fill="#FF0000" />
    </svg>
  ),
);

DrawRectangleUsingThreePointsMode.displayName =
  'DrawRectangleUsingThreePointsMode';

export default DrawRectangleUsingThreePointsMode;
