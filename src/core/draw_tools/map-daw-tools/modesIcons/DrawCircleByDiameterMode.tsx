import { memo } from 'react';

const DrawCircleByDiameterMode = memo(
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
    </svg>
  ),
);
DrawCircleByDiameterMode.displayName = 'DrawCircleByDiameterMode';

export default DrawCircleByDiameterMode;
