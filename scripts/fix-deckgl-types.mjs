import cpr from 'cpr';
/**
 * Cross platform version of this
 * https://github.com/uber/nebula.gl/blob/master/scripts/copyDeckglTypes.sh
 */

const CONFIG = {
  typesDist: "./node_modules/@types",
  typesSrc: ["./node_modules/@danmarshall/deckgl-typings/"],
}

CONFIG.typesSrc.forEach(folder => {
  cpr(folder, CONFIG.typesDist, { overwrite: true }, (err, files) => {
    if (err) console.log('[fix-deckgl-types]: Error', err);
    console.log(`[fix-deckgl-types]: ${files.length} definitions files installed from ${folder}`);
  });
});

