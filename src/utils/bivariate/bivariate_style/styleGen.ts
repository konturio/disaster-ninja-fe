export function featureProp(name) {
  return ['get', name];
}

export function getVariable(name) {
  return ['var', name];
}

export function less(first, second) {
  return ['<', first, second];
}

export function lessOrEqual(first, second) {
  return ['<=', first, second];
}

export function notEqual(first, second) {
  return ['!=', first, second];
}

export function equal(first, second) {
  return ['==', first, second];
}

export function caseFn(condition, output) {
  return [condition, output];
}

export function switchFn(...conditions) {
  const defaultCase = conditions.pop();
  return ['case', ...conditions.flat(2), defaultCase];
}

export function concat(...values) {
  return ['concat', ...values];
}

export function addVariable(name, binding, expression) {
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

function stringsToFeatureProp(expression) {
  if (typeof expression === 'string') {
    return expression === '1' ? 1 : featureProp(expression);
  }
  if (Array.isArray(expression)) {
    // ignore first item in array - it's operator
    return expression.map((exp, i) =>
      i === 0 ? exp : stringsToFeatureProp(exp),
    );
  }

  return expression;
}

/**
 * Generate class A1 - C3 resolver based on borders in mapbox style resolver
 * @param {string} xValue.propName - name of prop in feature properties for x axis
 * @param {Array}  xValue.borders  - xValue class borders
 * @param {string} yValue.propName - name of prop in feature properties for y axis
 * @param {Array}  yValue.borders  - yValue class borders
 */
export function classResolver(xValue, yValue) {
  const atCharCode = 64; // '@'.charCodeAt(0);
  const xAxisValue = stringsToFeatureProp(xValue.propName);
  const yAxisValue = stringsToFeatureProp(yValue.propName);

  return concat(
    switchFn(
      // cases for a, b, c ...
      xValue.borders.map((border, i) =>
        caseFn(less(xAxisValue, border), String.fromCharCode(atCharCode + i)),
      ),
      // default case required
      String.fromCharCode(atCharCode + xValue.borders.length),
    ),
    switchFn(
      // cases for 1, 2, 3 ...
      yValue.borders.map((border, i) => caseFn(less(yAxisValue, border), i)),
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
export function colorResolver(variableName, colorMap, fallbackColor) {
  return switchFn(
    Object.entries(colorMap).map(([cls, color]) =>
      // color cases
      caseFn(equal(getVariable(variableName), cls), color),
    ),
    fallbackColor,
  );
}
