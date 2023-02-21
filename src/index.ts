import '@reatom/react/react-dom-batched-updates';
import '@konturio/default-theme/variables.css';
import '@konturio/default-theme/defaults.css';
import '@konturio/default-theme/typography.css';
import jq from 'jquery';
import '~utils/atoms/disableDefaultStore';
import './global.css';
import { loadConfig } from '~core/app_config/loader';

const someBtn = jq('button');
console.error(someBtn);

function showCriticalError(e: Error) {
  const root = document.getElementById('root');
  if (root) {
    const wrapper = document.createElement('DIV');
    wrapper.className = 'critical-error-screen';
    const message = document.createElement('SPAN');
    message.className = 'critical-error-message';
    message.innerText = 'Application initialization failed. ';
    if (e.message) {
      message.innerText += e.message;
    }
    wrapper.appendChild(message);
    root.appendChild(wrapper);
  }
}

loadConfig()
  .then(() => {
    import('./App');
  })
  .catch((e: Error) => {
    // TODO: FE error reporting
    console.error(e);
    showCriticalError(e);
  });
