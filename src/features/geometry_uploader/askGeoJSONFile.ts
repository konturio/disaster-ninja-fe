import { readGeoJSON } from '~utils/geoJSON/helpers';

export function askGeoJSONFile(onSuccess: (geoJSON: GeoJSON.GeoJSON) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = false;
  input.click();
  input.onchange = async () => {
    if ('files' in input && input.files !== null) {
      const files = Array.from(input.files);
      const geoJSON = await readGeoJSON(files[0]);
      onSuccess(geoJSON);
    }
  };
}
