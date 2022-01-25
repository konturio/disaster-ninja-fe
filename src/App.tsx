import ReactDOM from 'react-dom';
import { RoutedApp } from './Routes';
import { reatomContext } from '@reatom/react';
import { store } from '~core/store/store';
import { BetaSplashScreen } from '~components/BetaSplashScreen/BetaSplashScreen';
import MockWrapper from '~utils/axios/MockWrapper';
import { YMInitializer } from 'react-yandex-metrika';

ReactDOM.render(
  <reatomContext.Provider value={store}>
    <YMInitializer accounts={window.konturAppConfig.YANDEX_METRICA_ID} />
    <BetaSplashScreen />
    <MockWrapper>
      <RoutedApp />
    </MockWrapper>
  </reatomContext.Provider>,
  document.getElementById('root'),
);

