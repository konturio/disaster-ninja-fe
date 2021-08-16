const yenv = require('yenv');

/**
 * @param {Object} settings
 * @param {string} settings.fileName
 * @returns {boolean}
 */
class RuntimeVariablesPlugin {
  constructor({
    fileName = 'config.json',
    filePath = null,
    yenv = { strict: false },
  }) {
    this.settings = {
      fileName,
      filePath,
      yenv,
    };
  }

  getRuntimeEnv() {
    let env = {};
    try {
      env = yenv('env.yml', { ...this.settings.yenv });
    } catch (e) {
      /* silent fail */
    }
    const envDefaults = yenv('env.default.yml', this.settings.yenv);
    const { runtime } = Object.assign(envDefaults, env);
    return runtime;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'RuntimeVariablesPlugin',
      (compilation, done) => {
        const { outputOptions, assets } = compilation;
        const runtimeVariables = this.getRuntimeEnv();
        const varsAsString = JSON.stringify(runtimeVariables);
        const filename =
          (this.settings.filePath || outputOptions.path) +
          '/' +
          this.settings.fileName;
        compilation.fileDependencies.add(filename);
        assets[this.settings.fileName] = {
          source: () => varsAsString,
          size: () => varsAsString.length,
        };
        done();
      },
    );
  }
}

module.exports = RuntimeVariablesPlugin;
