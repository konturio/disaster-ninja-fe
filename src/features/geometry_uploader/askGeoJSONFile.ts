import { currentNotificationAtom } from '~core/shared_state';
import { readGeoJSON } from '~utils/geoJSON/helpers';
import { i18n } from '~core/localization';

const input = (() => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = false;
  return input;
})();

export function askGeoJSONFile(onSuccess: (geoJSON: GeoJSON.GeoJSON) => void) {
  async function onchange() {
    if ('files' in input && input.files !== null) {
      const files = Array.from(input.files);
      try {
        const geoJSON = await readGeoJSON(files[0]);
        onSuccess(geoJSON);
      } catch (error) {
        currentNotificationAtom.showNotification.dispatch(
          'error',
          { title: i18n.t('geometry_uploader.error') },
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
