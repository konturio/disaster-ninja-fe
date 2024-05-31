export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const toCapitalizedList = (arr: string[]): string =>
  arr.map(capitalize).join(', ');
export const spacesToUnderscore = (str: string) => str.replace(/\s+/g, '_');
