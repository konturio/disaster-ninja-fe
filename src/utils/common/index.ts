const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const toCapitalizedList = (arr: string[]): string =>
  arr.map(capitalize).join(', ');

const capitalizeArrayOrString = (input: string[] | string): string =>
  Array.isArray(input) ? toCapitalizedList(input) : capitalize(input);

const sortByKey =
  <T>(key: string, direction: 'asc' | 'desc') =>
  (a: T, b: T) =>
    direction === 'desc' ? b[key] - a[key] : a[key] - b[key];

export { capitalize, toCapitalizedList, capitalizeArrayOrString, sortByKey };
