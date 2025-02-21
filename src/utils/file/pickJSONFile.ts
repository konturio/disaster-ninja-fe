import { readTextFile } from './readTextFile';

const input = (() => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = false;
  return input;
})();

// TODO: use for MCDA too
export function pickJSONFile(): Promise<object> {
  return new Promise((res, rej) => {
    async function onchange() {
      if ('files' in input && input.files !== null) {
        const files = Array.from(input.files);

        try {
          const s = await readTextFile(files[0]);
          const json = JSON.parse(s);
          res(json);
        } catch (error) {
          rej(error);
        } finally {
          input.removeEventListener('change', onchange);
          // this will run this function even after the file with the same name was uploaded
          input.value = '';
        }
      }
    }

    input.addEventListener('change', onchange);
    input.click();
  });
}
