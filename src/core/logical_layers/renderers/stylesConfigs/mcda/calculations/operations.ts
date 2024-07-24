export interface IsomorphMath<T> {
  add: (x: T, y: T) => T;
  sub: (x: T, y: T) => T;
  mult: (x: T, y: T) => T;
  div: (x: T, y: T) => T;
  log: (x: T) => T;
  log10: (x: T) => T;
  sqrt: (x: T) => T;
  cbrt: (x: T) => T;
  abs: (x: T) => T;
  sign: (x: T) => T;
}

export type MapExpression = maplibregl.ExpressionSpecification;

export class MapMath implements IsomorphMath<MapExpression> {
  add = (x: MapExpression, y: MapExpression): MapExpression => ['+', x, y];
  sub = (x: MapExpression, y: MapExpression): MapExpression => ['-', x, y];
  mult = (x: MapExpression, y: MapExpression): MapExpression => ['*', x, y];
  div = (x: MapExpression, y: MapExpression): MapExpression => ['/', x, y];
  log = (x: MapExpression): MapExpression => ['ln', x];
  log10 = (x: MapExpression): MapExpression => ['log10', x];
  sqrt = (x: MapExpression): MapExpression => ['sqrt', x];
  cbrt = (x: MapExpression): MapExpression =>
    this.mult(this.sign(x), ['^', this.abs(x), 1 / 3]);
  abs = (x: MapExpression): MapExpression => ['abs', x];
  sign = (x: MapExpression): MapExpression => ['case', ['<', x, 0], -1, 1];
}

export class JsMath implements IsomorphMath<number> {
  add = (x: number, y: number) => x + y;
  sub = (x: number, y: number) => x - y;
  mult = (x: number, y: number) => x * y;
  div = (x: number, y: number) => x / y;
  log = (x: number) => Math.log(x);
  log10 = (x: number) => Math.log10(x);
  sqrt = (x: number) => Math.sqrt(x);
  cbrt = (x: number) => Math.cbrt(x);
  abs = (x: number) => Math.abs(x);
  sign = (x: number) => Math.sign(x);
}
