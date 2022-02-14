import ReactDOM from 'react-dom';
import { RoutedApp } from './Routes';
import { reatomContext } from '@reatom/react';
import { store } from '~core/store/store';
import { BetaSplashScreen } from '~components/BetaSplashScreen/BetaSplashScreen';
import { AuthWrapper } from '~core/auth';

ReactDOM.render(
  <reatomContext.Provider value={store}>
    <BetaSplashScreen />
    <AuthWrapper>
      <RoutedApp />
    </AuthWrapper>
  </reatomContext.Provider>,
  document.getElementById('root'),
);
