import { memo } from 'react';

const Draw90DegreePolygonMode = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      d="M16 20C16 18.2852 15.6325 16.5903 14.9222 15.0296C14.2119 13.4688 13.1754 12.0784 11.8824 10.952L4 20H16Z"
      stroke="#FF0000"
      strokeWidth="2"
      fill="none"
    />
    <path d="M22 20H4L17 5" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
));

Draw90DegreePolygonMode.displayName = 'Draw90DegreePolygonMode';

export default Draw90DegreePolygonMode;
