// @ts-check

/**
 * @param {string} stageName
 * @param {string} buildTag
 * @returns
 */
export const transforms = (stageName, buildTag) => ({
  ['helm/disaster-ninja-fe/Chart.yaml']: (content) => {
    const regExp = /(version:)\s?(\d+.\d+.\d+)/gm;
    const result = regExp.exec(content);
    if (result === null) {
      throw Error('Not found `version` in file');
    }
    const version = result[2];
    const newVersion = version
      .split('.')
      .map((v, i, a) => {
        v = Number(v);
        if (isNaN(v)) {
          throw Error(`Failed to parse current version: ${version}`);
        }
        // Increase last number
        if (i === a.length - 1) return v + 1;
        return v;
      })
      .join('.');

    const newContent = content.replace(version, newVersion);
    return newContent;
  },
  [`helm/disaster-ninja-fe/values/values-${stageName}.yaml`]: (content) => {
    const regExp = /(tag:)\s?([\w\d-.]*)/gm;
    const result = regExp.exec(content);
    if (result === null) {
      throw Error('Not found `tag` in file');
    }
    const currentTag = result[2];
    const newContent = content.replace(currentTag, buildTag);
    return newContent;
  },
});
