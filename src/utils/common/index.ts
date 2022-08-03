const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const toCapitalizedList = (arr: string[]): string =>
  arr.map(capitalize).join(', ');

const sortByKey =
  <T extends Record<string, unknown>>(key: string, direction: 'asc' | 'desc') =>
  (a: T, b: T) => {
    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    }
    return 0;
  };

export { capitalize, toCapitalizedList, sortByKey };
