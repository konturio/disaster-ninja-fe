import ReactDOM from 'react-dom';
import { RoutedApp } from './Routes';
import { reatomContext } from '@reatom/react';
import { store } from '~core/store/store';

ReactDOM.render(
  <reatomContext.Provider value={store}>
    <RoutedApp />
  </reatomContext.Provider>,
  document.getElementById('root'),
);
