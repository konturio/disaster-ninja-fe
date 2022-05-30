export class MapIndex<T1, T2> {
  _mapIndex: Map<T1, T2>;
  _length: number;

  constructor() {
    this._mapIndex = new Map<T1, T2>();
    this._length = 0;
  }

  get length(): number {
    return this._length;
  }

  getKeyIndex(key: T1): number {
    let i = 0;
    for (const mapIndexKey of this._mapIndex.keys()) {
      if (mapIndexKey === key) {
        return i;
      }
      i++;
    }
    return -1;
  }

  setValueAndGetIndex(key: T1, value: T2): number {
    if (this._mapIndex.has(key)) {
      return this.getKeyIndex(key);
    }
    this._length++;
    this._mapIndex.set(key, value);
    return this._length - 1;
  }

  dump(): Array<[T1, T2]> {
    return Array.from(this._mapIndex.entries());
  }
}
