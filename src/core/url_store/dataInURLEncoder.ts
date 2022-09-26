interface CodecCustomTransformer {
  decode: (str: string) => unknown;
  encode: (data: any) => string | null;
}

export class URLDataInSearchEncoder {
  #transformers: Map<string, CodecCustomTransformer> = new Map();
  #order: string[] = [];

  constructor({
    transformers,
    order,
  }: {
    transformers?: Record<string, CodecCustomTransformer>;
    order?: string[];
  } = {}) {
    if (transformers) {
      this.#transformers = new Map(Object.entries(transformers));
    }
    if (order) {
      this.#order = order;
    }
  }

  // encode<T extends { [s: string]: string | number | string[] | number[]; }>(data: T) {
  encode<T extends Record<string, string | number | string[] | number[]>>(data: T) {
    const dataEntries = Object.entries(data);

    // Sort according preferred order
    if (this.#order.length) {
      dataEntries.sort((a, b) => {
        if (this.#order.indexOf(a[0]) === -1) return 1;
        if (this.#order.indexOf(b[0]) === -1) return -1;

        return this.#order.indexOf(a[0]) - this.#order.indexOf(b[0]);
      });
    }

    const notInvalidValue = (v: unknown) =>
      (typeof v === 'number' ? !isNaN(v) : true) && v !== undefined && v !== null;

    // Omit invalid values, apply custom transformers, convert to string
    const normalized = dataEntries.reduce((acc, [key, val]) => {
      if (notInvalidValue(val)) {
        if (this.#transformers.has(key)) {
          const value = this.#transformers.get(key)!.encode(val);
          if (value !== null) acc.push([key, value]);
        } else {
          acc.push([key, String(val)]);
        }
      }
      return acc;
    }, [] as string[][]);

    return new URLSearchParams(normalized)
      .toString() // convert to string according to URL spec
      .replaceAll('%2F', '/'); // keep slashes (used in map property in "map=z/x/y")
  }

  decode<T = Record<string, string | number | string[] | number[]>>(
    metaString: string,
  ): T {
    if (metaString.length === 0) return {} as T;
    const params = new URLSearchParams(metaString);
    // apply transformers
    return Array.from(params.entries()).reduce((acc, [key, val]) => {
      if (this.#transformers.has(key)) {
        const value = this.#transformers.get(key)!.decode(val);
        if (value !== null) acc[key] = value;
      } else {
        acc[key] = val;
      }
      return acc;
    }, {} as T);
  }
}
