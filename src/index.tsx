import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';
import '@k2-packages/default-theme/variables.css';
import '@k2-packages/default-theme/defaults.css';
import './main.css';
import getAppModule from '~appModule/module';
import MainView from '~views/Main';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import store from './store';
import './i18n';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <DynamicModuleLoader modules={[getAppModule()]}>
        <MainView />
      </DynamicModuleLoader>
    </Provider>
  </StrictMode>,
  document.getElementById('root'),
);
