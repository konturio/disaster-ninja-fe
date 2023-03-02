import type maplibregl from 'maplibre-gl';

export interface IsomorphMath<T> {
  add: (x: T, y: T) => T;
  sub: (x: T, y: T) => T;
  mult: (x: T, y: T) => T;
  div: (x: T, y: T) => T;
  log: (x: T) => T;
  sqrt: (x: T) => T;
}

export type MapExpression = maplibregl.Expression;

export class MapMath implements IsomorphMath<MapExpression> {
  add = (x: MapExpression, y: MapExpression) => ['+', x, y] as MapExpression;
  sub = (x: MapExpression, y: MapExpression) => ['-', x, y] as MapExpression;
  mult = (x: MapExpression, y: MapExpression) => ['*', x, y] as MapExpression;
  div = (x: MapExpression, y: MapExpression) => ['/', x, y] as MapExpression;
  log = (x: MapExpression) => ['ln', x] as MapExpression;
  sqrt = (x: MapExpression) => ['sqrt', x] as MapExpression;
}

export class JsMath implements IsomorphMath<number> {
  add = (x: number, y: number) => x + y;
  sub = (x: number, y: number) => x - y;
  mult = (x: number, y: number) => x * y;
  div = (x: number, y: number) => x / y;
  log = (x: number) => Math.log(x);
  sqrt = (x: number) => Math.sqrt(x);
}
