export class URLDataInSearchEncoder {
  _arraySep = ',';
  _arrayStart = ',';
  _keyValSep = '=';
  _paramSep = '&';
  _specials = {
    map: {
      decode: (str: string) => str.split('/').map((s) => Number(s)),
      encode: (position: [number, number, number]) => position.join('/'),
    },
  };

  encode<T = Record<string, string | number | string[] | number[]>>(data: T) {
    const urlMetaStrings: string[] = [];
    Object.entries(data).reduce((acc, [key, val]) => {
      if (val === null || val === undefined) return acc;
      if (this._specials[key]) {
        val = this._specials[key].encode(val);
      } else if (Array.isArray(val)) {
        val =
          this._arrayStart +
          val.map((v) => encodeURIComponent(v)).join(this._arraySep);
      } else {
        val = encodeURIComponent(val);
      }
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
      if (this._specials[key]) {
        acc[key] = this._specials[key].decode(val);
      } else if (val.slice(0, this._arrayStart.length) === this._arrayStart) {
        const arrayVal = val
          .slice(this._arrayStart.length)
          .split(this._arraySep);
        acc[key] = arrayVal
          .filter((v) => v !== '')
          .map((v) => decodeURIComponent(v));
      } else {
        acc[key] = decodeURIComponent(val);
      }
      return acc;
    }, {} as T);
  }
}
