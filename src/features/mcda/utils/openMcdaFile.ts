import { i18n } from '~core/localization';
import { currentNotificationAtom } from '~core/shared_state';
import { DEFAULT_MCDA_NAME } from '../constants';
import { generateMCDAId } from './generateMCDAId';
import { validateMCDAConfig } from './validateMCDAConfig';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

const input = (() => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = false;
  return input;
})();

export function createMCDAConfigFromJSON(json: Partial<MCDAConfig>): MCDAConfig {
  const result: Partial<MCDAConfig> = { ...json };
  if (!result.version || result.version < 4) {
    throw new Error(i18n.t('mcda.error_wrong_mcda_version'));
  }
  if (!result.id) {
    result.id = generateMCDAId(result.name);
  }
  if (!result.name) {
    result.name = result.id ?? DEFAULT_MCDA_NAME;
  }
  return validateMCDAConfig(result);
}

function readMcdaJSONFile(file): Promise<MCDAConfig> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      if (event.target === null) return;
      const s = event.target.result?.toString();
      if (!s) return;
      try {
        const json = JSON.parse(s);
        // if json has "type" property, it's MCDALayerStyle, otherwise we assume it's MCDAConfig
        const jsonConfig: Partial<MCDAConfig> =
          json?.type === 'mcda' ? json.config : json;
        const mcdaConfig = createMCDAConfigFromJSON(jsonConfig);
        res({ ...mcdaConfig } as MCDAConfig);
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
        const mcdaConfig = await readMcdaJSONFile(files[0]);
        onSuccess(mcdaConfig);
      } catch (error) {
        currentNotificationAtom.showNotification.dispatch(
          'error',
          { title: (error as Error).message ?? i18n.t('mcda.error_invalid_file') },
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
