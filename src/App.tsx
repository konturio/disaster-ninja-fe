import ReactDOM from 'react-dom';
import { RoutedApp } from './Routes';
import { reatomContext } from '@reatom/react';
import { store } from '~core/store/store';
import { BetaSplashScreen } from '~components/BetaSplashScreen/BetaSplashScreen';
import MockWrapper from '~utils/axios/MockWrapper';

ReactDOM.render(
  <reatomContext.Provider value={store}>
    <BetaSplashScreen />
    <MockWrapper>
      <RoutedApp />
    </MockWrapper>
  </reatomContext.Provider>,
  document.getElementById('root'),
);

