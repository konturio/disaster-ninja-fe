import { useAtom } from '@reatom/react-v2';
import { intercomVisibleAtom } from '.';
import './intercom.css';

/* Just placeholder */
export function IntercomBTN() {
  const [isVisible] = useAtom(intercomVisibleAtom);
  return isVisible ? <div style={{ width: '50px', height: '40px' }}></div> : null;
}
