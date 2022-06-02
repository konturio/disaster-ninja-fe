export class Matrix<T> {
  _matrix: (T | null)[][];

  constructor() {
    this._matrix = [];
  }

  set(y: number, x: number, value: T): void {
    if (!this._matrix[y]) {
      this._matrix[y] = [];
    }
    this._matrix[y][x] = value;
  }

  dump(cols: number, rows: number) {
    const outMatrix: (T | null)[][] = new Array<(T | null)[] | null>(rows)
      .fill(null)
      .map(() => new Array<T | null>(cols).fill(null));
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (this._matrix[i] && this._matrix[i][j] !== undefined) {
          outMatrix[i][j] = this._matrix[i][j];
        }
      }
    }
    return outMatrix;
  }
}
