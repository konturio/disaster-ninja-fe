import ReactDOM from 'react-dom';
import { RoutedApp } from './Routes';
import { reatomContext } from '@reatom/react';
import { store } from '~core/store/store';
import { AuthWrapper } from '~core/auth';

console.log('test');
console.log('test2');

ReactDOM.render(
  <reatomContext.Provider value={store}>
    <AuthWrapper>
      <RoutedApp />
    </AuthWrapper>
  </reatomContext.Provider>,
  document.getElementById('root'),
);
