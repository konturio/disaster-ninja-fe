import { memo } from 'react';

const EditInOsmIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.43499 10.5717L3.47492 15.5318L3.47492 20.4816H8.42467L13.3847 15.5214M8.43499 10.5717L11.617 7.38968L16.5667 12.3394L13.3847 15.5214M8.43499 10.5717L13.3847 15.5214" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17.3522 1H23.3522M23.3522 1V7M23.3522 1L17.3522 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
  </svg>

));

EditInOsmIcon.displayName = 'EditInOsmIcon';

export default EditInOsmIcon;
