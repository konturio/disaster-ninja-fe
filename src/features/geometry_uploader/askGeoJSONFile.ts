import { readGeoJSON } from '~utils/geoJSON/helpers';

const input = (() => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = false;
  return input;
})();

export function askGeoJSONFile(onSuccess: (geoJSON: GeoJSON.GeoJSON) => void) {
  const onchange = async () => {
    if ('files' in input && input.files !== null) {
      const files = Array.from(input.files);
      const geoJSON = await readGeoJSON(files[0]);
      onSuccess(geoJSON);
    }
  };

  input.addEventListener('change', onchange);
  input.click();
}
