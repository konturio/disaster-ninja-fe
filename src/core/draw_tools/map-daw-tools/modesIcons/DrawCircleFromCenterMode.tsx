import { memo } from 'react';

const DrawCircleFromCenterMode = memo(
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="12" cy="12" r="3" fill="#FF0000" />
    </svg>
  ),
);
DrawCircleFromCenterMode.displayName = 'DrawCircleFromCenterMode';

export default DrawCircleFromCenterMode;
