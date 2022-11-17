import { createRoot } from 'react-dom/client';
import { reatomContext } from '@reatom/react';
import { StrictMode } from 'react';
import { store } from '~core/store/store';
import { AuthWrapper } from '~core/auth';
import { runGoogleTagManager } from '~utils/metrics/tagManager';
import { Views } from '~views/Common';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <reatomContext.Provider value={store}>
      <AuthWrapper>
        <Views />
      </AuthWrapper>
    </reatomContext.Provider>
  </StrictMode>,
);

// delayed run of statistics
// 4 seconds is the time we'd expect app to be ready
// TODO put this to when app is loaded when task #11042 is done
if (import.meta.env?.MODE !== 'development')
  try {
    setTimeout(() => {
      runGoogleTagManager();
    }, 4000);
  } catch (error) {
    console.warn('error when loading statistics', error);
  }
