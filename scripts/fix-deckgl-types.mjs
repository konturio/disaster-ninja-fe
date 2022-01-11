import fs from 'fs';
import cpr from 'cpr';
/**
 * Cross platform version of this
 * https://github.com/uber/nebula.gl/blob/master/scripts/copyDeckglTypes.sh
 */

const CONFIG = {
  typesDist: './node_modules/@types',
  typesSrc: [
    './node_modules/@danmarshall/deckgl-typings/',
    './node_modules/.pnpm/@danmarshall/deckgl-typings/',
  ].filter((s) => fs.existsSync(s)),
};

CONFIG.typesSrc.forEach((folder) => {
  cpr(folder, CONFIG.typesDist, { overwrite: true }, (err, files) => {
    if (err) console.log('[fix-deckgl-types]: ', err);
    else {
      console.log(
        `[fix-deckgl-types]: ${files.length} definitions files installed from ${folder}`,
      );
    }
  });
});
