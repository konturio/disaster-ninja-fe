import ReactDOM from 'react-dom';
import { reatomContext } from '@reatom/react';
import { store } from '~core/store/store';
import { AuthWrapper } from '~core/auth';
import { runGoogleTagManager } from '~utils/metrics/tagManager';
import { RoutedApp } from './Routes';

ReactDOM.render(
  <reatomContext.Provider value={store}>
    <AuthWrapper>
      <RoutedApp />
    </AuthWrapper>
  </reatomContext.Provider>,
  document.getElementById('root'),
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
