export function featureProp<T>(name: T) {
  return ['get', name];
}

export function getVariable<T>(name: T) {
  return ['var', name];
}

export function less<T, R>(first: T, second: R) {
  return ['<', first, second];
}

export function lessOrEqual<T, R>(first: T, second: R) {
  return ['<=', first, second];
}

export function notEqual<T, R>(first: T, second: R) {
  return ['!=', first, second];
}

export function equal<T, R>(first: T, second: R) {
  return ['==', first, second];
}

export function caseFn<T, R>(condition: T, output: R) {
  return [condition, output];
}

export function switchFn<T>(defaultCase: number | string, conditions: Array<T>) {
  return ['case', ...conditions.flat(2), defaultCase];
}

export function concat<T, R>(first: T, second: R) {
  return ['concat', first, second];
}

export function addVariable<T, R>(name: string, binding: T, expression: R) {
  return ['let', name, binding, expression];
}

export function toNumber(value) {
  return ['to-number', value, 0];
}

export function allCondition(...conditionInputs) {
  return ['all', ...conditionInputs];
}

export function anyCondition(...conditionInputs) {
  return ['any', ...conditionInputs];
}

type FeaturePropReturn = number | string | Array<FeaturePropReturn>;

function stringsToFeatureProp(expression: Array<string> | string): FeaturePropReturn {
  if (typeof expression === 'string') {
    return expression === '1' ? 1 : featureProp(expression);
  } else {
    // ignore first item in array - it's operator
    return expression.map((exp, i) => (i === 0 ? exp : stringsToFeatureProp(exp)));
  }
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
  propName: Array<string>;
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
  const xAxisValue = stringsToFeatureProp(xValue.propName);
  const yAxisValue = stringsToFeatureProp(yValue.propName);

  return concat(
    switchFn(
      // default case required
      getCharByIndex(xValue.borders.length),
      // cases for a, b, c ...
      xValue.borders.map((border, i, arr) =>
        caseFn(getConditionFunc(i, arr.length)(xAxisValue, border), getCharByIndex(i)),
      ),
    ),
    switchFn(
      // default case required
      yValue.borders.length,
      // cases for 1, 2, 3 ...
      yValue.borders.map((border, i, arr) =>
        caseFn(getConditionFunc(i, arr.length)(yAxisValue, border), i),
      ),
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
    fallbackColor,
    Object.entries(colorMap).map(([cls, color]) =>
      // color cases
      caseFn(equal(getVariable(variableName), cls), color),
    ),
  );
}
