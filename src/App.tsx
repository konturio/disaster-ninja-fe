import ReactDOM from 'react-dom';
import { RoutedApp } from './Routes';
import { reatomContext } from '@reatom/react';
import { store } from '~core/store/store';
import { BetaSplashScreen } from '~components/BetaSplashScreen/BetaSplashScreen';
import MockWrapper from '~utils/axios/MockWrapper';
import { YMInitializer } from 'react-yandex-metrika';
import { AuthWrapper } from '~features/user_profile';

ReactDOM.render(
  <reatomContext.Provider value={store}>
    <YMInitializer accounts={window.konturAppConfig.YANDEX_METRICA_ID} />
    <BetaSplashScreen />
    <MockWrapper>
      <AuthWrapper>
        <RoutedApp />
      </AuthWrapper>
    </MockWrapper>
  </reatomContext.Provider>,
  document.getElementById('root'),
);

