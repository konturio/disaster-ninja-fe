const { mv, ls, mkdir, isFolder } = require('../utils');

class SortOutput {
  distPath = null;

  constructor(rules) {
    this.rules = rules;
    this.start = this._start.bind(this);
  }

  filtrate(arr, include = /.*/, exclude) {
    const whitelisted = arr.filter((f) => include.test(f));
    return exclude ? whitelisted.filter((f) => !exclude.test(f)) : whitelisted;
  }

  async fileList() {
    const fileNames = await ls(this.distPath);
    return fileNames.map((fileName) => `${this.distPath}/${fileName}`);
  }

  async createFolder(path) {
    return mkdir(path);
  }

  async checkFolderExistence(path) {
    return isFolder(path);
  }

  move(file, folder) {
    return mv(file, folder);
  }

  getFullOutputPath(output) {
    return `${this.distPath}/${output}`;
  }

  async generateMoveTasks() {
    const fileList = await this.fileList();
    return this.rules.reduce((acc, { include, exclude, output }) => {
      const folder = this.getFullOutputPath(output);
      if (acc[folder] === undefined) acc[folder] = [];
      const needMove = this.filtrate(fileList, include, exclude);
      acc[folder] = acc[folder].concat(needMove);
      return acc;
    }, {});
  }

  /**
   * @return Promise<{ [targetPath]: filePath[] }>
   */
  async _start() {
    const moveTasks = await this.generateMoveTasks();
    for (const [folder, files] of Object.entries(moveTasks)) {
      const folderExist = await this.checkFolderExistence(folder);
      if (!folderExist) {
        await this.createFolder(folder);
      }
      files
        .filter((file) => file !== folder)
        .map((file) => this.move(file, folder));
    }
  }
}

/**
 * @param {Object} rules
 * @param {string} rules.test
 * @param {string} rules.output
 */
class SortOutputWebpackPlugin extends SortOutput {
  apply(compiler) {
    this.distPath = compiler.options.output.path;
    if (compiler.hooks) {
      compiler.hooks.afterEmit.tapAsync('afterEmit', this.start);
    } else {
      compiler.plugin('after-emit', this.start);
    }
  }
}

module.exports = SortOutputWebpackPlugin;
