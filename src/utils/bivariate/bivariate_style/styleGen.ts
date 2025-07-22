import type { ExpressionSpecification } from 'maplibre-gl';

export function featureProp(name: string): ExpressionSpecification {
  return ['get', name];
}

export function getVariable(name: string): ExpressionSpecification {
  return ['var', name];
}

export function less(first, second): ExpressionSpecification {
  return ['<', first, second];
}

export function lessOrEqual(first, second): ExpressionSpecification {
  return ['<=', first, second];
}

export function greaterOrEqual(first, second): ExpressionSpecification {
  return ['>=', first, second];
}

export function notEqual(first, second): ExpressionSpecification {
  return ['!=', first, second];
}

export function equal(first, second): ExpressionSpecification {
  return ['==', first, second];
}

export function caseFn(condition, output): ExpressionSpecification {
  return [condition, output];
}

export function switchFn<T>(conditions: Array<T>, defaultCase: number | string) {
  return ['case', ...conditions.flat(1), defaultCase];
}

export function concat<T, R>(first: T, second: R) {
  return ['concat', first, second];
}

export function addVariable(name, binding, expression): ExpressionSpecification {
  return ['let', name, binding, expression];
}

export function toNumber(value) {
  return ['to-number', value, 0];
}

export function allCondition(...conditionInputs): ExpressionSpecification {
  return ['all', ...conditionInputs];
}

export function anyCondition(...conditionInputs): ExpressionSpecification {
  return ['any', ...conditionInputs];
}

const AT_CHAR_CODE = 64; // '@'.charCodeAt(0);
export const getCharByIndex = (i: number) => String.fromCharCode(AT_CHAR_CODE + i); //get A - C by index

/**
 * Return condition based on border range
 * all ranges - <
 * last range - <=
 * @param {number} currentIndex - index of current range
 * @param {number} totalBorders - length of borders array
 */
const getConditionFunc = (currentIndex: number, totalBorders: number) =>
  currentIndex === totalBorders - 1 ? lessOrEqual : less;

export type AxisValue = {
  propName: ExpressionSpecification;
  borders: Array<number>;
};
/**
 * Generate class A1 - C3 resolver based on borders in mapbox style resolver
 * @param xValue.propName - name of prop in feature properties for x axis
 * @param xValue.borders  - xValue class borders
 * @param yValue.propName - name of prop in feature properties for y axis
 * @param yValue.borders  - yValue class borders
 */
export function classResolver(xValue: AxisValue, yValue: AxisValue) {
  return concat(
    switchFn(
      // cases for a, b, c ...
      xValue.borders.map((border, i, arr) =>
        caseFn(
          getConditionFunc(i, arr.length)(xValue.propName, border),
          getCharByIndex(i),
        ),
      ),
      // default case required
      getCharByIndex(xValue.borders.length),
    ),
    switchFn(
      // cases for 1, 2, 3 ...
      yValue.borders.map((border, i, arr) =>
        caseFn(getConditionFunc(i, arr.length)(yValue.propName, border), i),
      ),
      // default case required
      yValue.borders.length,
    ),
  );
}

/**
 * Generate mapbox class-color resolver
 * @param {string} variableName - name of variable width feature class (a1 - c3)
 * @param {Object} colorMap     - { class: color } map
 * @param {String} color        - color for classes missed in color map
 */
export function colorResolver(
  variableName: string,
  colorMap: Record<string, string>,
  fallbackColor: string,
) {
  return switchFn(
    Object.entries(colorMap).map(([cls, color]) =>
      // color cases
      caseFn(equal(getVariable(variableName), cls), color),
    ),
    fallbackColor,
  );
}
