export class URLDataInSearchEncoder {
  _arraySep = ',';
  _arrayStart = '[]';
  _keyValSep = '=';
  _paramSep = '&';

  encode<T = Record<string, string | number | string[] | number[]>>(data: T) {
    const urlMetaStrings: string[] = [];
    Object.entries(data).reduce((acc, [key, val]) => {
      if (val === null || val === undefined) return acc;
      if (Array.isArray(val)) val = this._arrayStart + val.join(this._arraySep);
      acc.push(`${key}${this._keyValSep}${val}`);
      return acc;
    }, urlMetaStrings);
    return urlMetaStrings.join(this._paramSep);
  }

  decode<T = Record<string, string | number | string[] | number[]>>(
    metaString: string,
  ): T {
    if (metaString.length === 0) return {} as T;
    return metaString.split(this._paramSep).reduce((acc, pair) => {
      const [key, val = ''] = pair.split(this._keyValSep);
      if (val.slice(0, this._arrayStart.length) === this._arrayStart) {
        const arrayVal = val
          .slice(this._arrayStart.length)
          .split(this._arraySep);
        acc[key] = arrayVal.filter((v) => v !== '');
      } else {
        acc[key] = val;
      }
      return acc;
    }, {} as T);
  }
}
