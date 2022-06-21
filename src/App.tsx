import ReactDOM from 'react-dom';
import { reatomContext } from '@reatom/react';
import { store } from '~core/store/store';
import { AuthWrapper } from '~core/auth';
import { RoutedApp } from './Routes';

console.log('test');

ReactDOM.render(
  <reatomContext.Provider value={store}>
    <AuthWrapper>
      <RoutedApp />
    </AuthWrapper>
  </reatomContext.Provider>,
  document.getElementById('root'),
);
