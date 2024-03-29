export interface IsomorphMath<T> {
  add: (x: T, y: T) => T;
  sub: (x: T, y: T) => T;
  mult: (x: T, y: T) => T;
  div: (x: T, y: T) => T;
  log: (x: T) => T;
  sqrt: (x: T) => T;
}

export type MapExpression = maplibregl.ExpressionSpecification;

export class MapMath implements IsomorphMath<MapExpression> {
  add = (x: MapExpression, y: MapExpression): MapExpression => ['+', x, y];
  sub = (x: MapExpression, y: MapExpression): MapExpression => ['-', x, y];
  mult = (x: MapExpression, y: MapExpression): MapExpression => ['*', x, y];
  div = (x: MapExpression, y: MapExpression): MapExpression => ['/', x, y];
  log = (x: MapExpression): MapExpression => ['ln', x];
  sqrt = (x: MapExpression): MapExpression => ['sqrt', x];
}

export class JsMath implements IsomorphMath<number> {
  add = (x: number, y: number) => x + y;
  sub = (x: number, y: number) => x - y;
  mult = (x: number, y: number) => x * y;
  div = (x: number, y: number) => x / y;
  log = (x: number) => Math.log(x);
  sqrt = (x: number) => Math.sqrt(x);
}
