type HashFuncType = (x: string, y: string) => string;
const defaultHashFn = (x: string, y: string) => `${x}|${y}`;

export class HashMap<T> {
  _hashFunc: HashFuncType;
  _createGroups: boolean;
  _hash: Map<string, T | T[]>;

  constructor(createGroups?: boolean, hashFn?: HashFuncType) {
    this._createGroups = createGroups !== undefined ? createGroups : false;
    this._hashFunc = hashFn !== undefined ? hashFn : defaultHashFn;
    this._hash = new Map<string, T | T[]>();
  }

  get(x: string, y: string): T | T[] | undefined {
    return this._hash.get(this._hashFunc(x, y));
  }

  set(x: string, y: string, val: T): void {
    const hash = this._hashFunc(x, y);
    if (this._createGroups) {
      if (!this._hash.has(hash)) {
        this._hash.set(hash, []);
      }
      (this._hash.get(hash) as T[]).push(val);
    } else {
      this._hash.set(hash, val);
    }
  }

  dump() {
    console.debug(this._hash);
  }
}
