import { saveAs } from 'file-saver';
// Remove that after ECMA 2021 released
import 'core-js/features/string/replace-all';

const emptyGeoJson = {
  type: 'FeatureCollection',
  features: [],
};

export function downloadPrompt(geoJSON = emptyGeoJson) {
  return new Promise((res) => {
    const blob = new Blob([JSON.stringify(geoJSON, null, 2)], {
      type: 'application/geo+json;charset=utf-8',
    });
    saveAs(
      blob,
      `sketch_${new Date().toISOString().replaceAll(':', '-')}.json`,
    );
    res(true);
  });
}

/* Uploading */

// Hack taked from 'file-saver'
function click(node) {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null,
    );
    node.dispatchEvent(evt);
  }
}

function createElement(tagName: string, options: Record<string, unknown>) {
  const el = document.createElement(tagName);
  Object.entries(options).map(([key, val]) => {
    el[key] = val;
  });
  return el;
}

export function uploadPrompt(
  currentGeoJSON = emptyGeoJson,
  options: any = { addGeometry: true },
): Promise<GeoJSON.GeoJSON | null> {
  if (!options) {
    options = { addGeometry: true };
  }
  return new Promise((res, rej) => {
    let focusTimeout: any = null;

    const inputEl: any = createElement('input', {
      type: 'file',
      accept: '.json,.geojson',
      id: 'upload',
      name: 'upload',
    });

    inputEl.onchange = (e) => {
      inputEl.onchange = null;
      if (focusTimeout) {
        clearTimeout(focusTimeout);
      }
      if (e.target.files.length === 0) {
        res(null);
      }
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = (readerEvent) => {
        reader.onload = null;

        if (readerEvent.target) {
          const content = readerEvent.target.result;
          if (typeof content === 'string') {
            try {
              const geoJSON = JSON.parse(content);
              if (
                options.addGeometry &&
                currentGeoJSON &&
                currentGeoJSON.features &&
                currentGeoJSON.features.length
              ) {
                res({
                  type: 'FeatureCollection',
                  features: [...currentGeoJSON.features, ...geoJSON.features],
                });
              } else {
                res(geoJSON);
              }
            } catch (e) {
              res(null);
            }
          }
        }
      };
    };

    // detect that cancel button is clicked with setTimeout hack
    document.body.onfocus = () => {
      document.body.onfocus = null;
      // TODO: find how to remove this hack
      focusTimeout = setTimeout(() => {
        res(null);
      }, 300);
    };
    click(inputEl);
  });
}
