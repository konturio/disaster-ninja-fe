import { useCallback, useState } from 'react';
import s from './BetaSplashScreen.module.css';

const CLOSED_SCREEN_KEY = 'betaScreenWasClosed';

export function BetaSplashScreen() {
  const [visible, setVisible] = useState(
    window.localStorage.getItem(CLOSED_SCREEN_KEY) !== 'true',
  );

  const onClose = useCallback(() => {
    setVisible(false);
    window.localStorage.setItem(CLOSED_SCREEN_KEY, 'true');
  }, []);

  return visible ? (
    <div className={s.shadow} onClick={onClose}>
      <div className={s.modal}>
        {[
          'You are using a beta version of Disaster Ninja.',
          'It introduces a lot of new features and may have a few bugs which we will fix soon. Please, in any doubt contact us in the chatbox or use the stable',
        ].join('\n')}
        <a href="https://disaster.ninja/live/">Disaster Ninja →</a>
        <button className={s.btn}>Have a look</button>
      </div>
    </div>
  ) : null;
}
