const path = require('path');
const $root = Symbol.for('projectRoot');
const yenv = require('yenv');
const fs = require('fs').promises;
const rimraf = require('rimraf');
const ncp = require('ncp').ncp;

const relativePath = (dotPath) => path.resolve(process[$root], dotPath);
module.exports.relativePath = relativePath;

function setRoot(rootDir) {
  process[$root] = rootDir;
}
module.exports.setRoot = setRoot;

let cachedEnv = null;
const yEnvOptions = { strict: false };
function getEnv() {
  if (cachedEnv === null) {
    let env = {};
    try {
      env = yenv('env.yml', yEnvOptions);
    } catch (e) {}
    const envDefaults = yenv('env.default.yml', yEnvOptions);
    const { runtime, ...buildTimeEnv } = Object.assign(envDefaults, env);
    cachedEnv = buildTimeEnv;
  }
  return cachedEnv;
}
module.exports.getEnv = getEnv;

function rm(dist) {
  return new Promise((res, rej) =>
    rimraf(dist, { disableGlob: true }, (error) =>
      error ? rej(error) : res(),
    ),
  );
}
module.exports.rm = rm;

function mvRecursive(from, to) {
  const options = {
    stopOnErr: true,
    clobber: false,
    limit: 10,
  };
  return new Promise((res, rej) => {
    ncp(from, to, options, (errList) => {
      if (errList) return rej(errList[0]);
      rm(from).then(res).catch(rej);
    });
  });
}

function cp(from, to, { recursive } = { recursive: false }) {
  try {
    return mvRecursive(from, to);
  } catch (error) {
    console.error(`copy ${from} -> ${to} ${
      recursive ? 'in recursive mode' : ''
    } failed.
    Reason: ${error}`);
  }
}
module.exports.cp = cp;

async function mv(from, to) {
  const recursive = await isFolder(from);
  return cp(from, to + '/' + path.basename(from), { recursive });
}
module.exports.mv = mv;

module.exports.ls = fs.readdir;

function mkdir(path) {
  return fs.mkdir(path, { recursive: true });
}
module.exports.mkdir = mkdir;

async function isFolder(path) {
  try {
    const stat = await fs.stat(path);
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
}

module.exports.isFolder = isFolder;

const erase = (path) => {
  const expression = '^' + path;
  return { [expression]: '' };
};

function addProxies(rules = []) {
  return rules.reduce((proxies, rule) => {
    proxies[rule.from] = {
      target: rule.to,
      pathRewrite: erase(rule.from),
      secure: false,
      changeOrigin: true,
    };

    if (rule.debug) {
      proxies[rule.from].logLevel = 'debug';
    }

    return proxies;
  }, {});
}

module.exports.addProxies = addProxies;

function writeJSON(path, json, formatted) {
  try {
    require('fs').writeFileSync(
      path,
      JSON.stringify(json, null, formatted ? 2 : undefined),
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports.writeJSON = writeJSON;
