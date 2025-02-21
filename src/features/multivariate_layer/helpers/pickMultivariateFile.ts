import { i18n } from '~core/localization';
import { currentNotificationAtom } from '~core/shared_state';
import { pickJSONFile } from '~utils/file/pickJSONFile';

export async function pickMultivariateFile(onSuccess: (json: object) => void) {
  try {
    const configJson = await pickJSONFile();
    onSuccess(configJson);
  } catch (error) {
    currentNotificationAtom.showNotification.dispatch(
      'error',
      { title: (error as Error).message ?? i18n.t('mcda.error_invalid_file') },
      5,
    );
  }
}
