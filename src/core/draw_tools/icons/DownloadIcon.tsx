import { memo } from 'react';

const DownloadIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.01388 1V11.3735M9.01388 11.3735L4.99841 7.35803M9.01388 11.3735L13.0294 7.35803"
      stroke="white"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 10.9283V15.716C1 16.2683 1.44772 16.716 2 16.716H16.0277C16.58 16.716 17.0277 16.2683 17.0277 15.716V10.9283"
      stroke="white"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

DownloadIcon.displayName = 'DownloadIcon';

export default DownloadIcon;
