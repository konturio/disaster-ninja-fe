import { i18n } from '~core/localization';
import { currentNotificationAtom } from '~core/shared_state';
import { isMCDAConfig } from './mcdaConfig';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

const input = (() => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = false;
  return input;
})();

function readMcdaJSONFile(file): Promise<MCDAConfig> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      if (event.target === null) return;
      const s = event.target.result?.toString();
      if (!s) return;
      try {
        const json = JSON.parse(s);
        if (isMCDAConfig(json)) {
          return res({ ...json, custom: true } as MCDAConfig);
        } else {
          throw new Error('Not an MCDA JSON format');
        }
      } catch (error) {
        rej(error);
      }
    };
    reader.onerror = (error) => rej(error);
    reader.readAsText(file);
  });
}

export function askMcdaJSONFile(onSuccess: (mcdaConfig: MCDAConfig) => void) {
  async function onchange() {
    if ('files' in input && input.files !== null) {
      const files = Array.from(input.files);
      try {
        const json = await readMcdaJSONFile(files[0]);
        onSuccess(json);
      } catch (error) {
        currentNotificationAtom.showNotification.dispatch(
          'error',
          { title: i18n.t('mcda.error_invalid_file') },
          5,
        );
      } finally {
        input.removeEventListener('change', onchange);
        // this will run this function even after the file with the same name was uploaded
        input.value = '';
      }
    }
  }

  input.addEventListener('change', onchange);
  input.click();
}
