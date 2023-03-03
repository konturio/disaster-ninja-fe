export function transformIconLink(iconPath: string) {
  if (iconPath.startsWith('http')) return iconPath;

  const iconLocations = iconPath.split('/');
  const iconName = iconLocations[iconLocations.length - 1];
  const iconStaticPath =
    import.meta.env?.VITE_BASE_PATH +
    import.meta.env?.VITE_STATIC_PATH +
    'favicon/' +
    iconName;
  return iconStaticPath;
}

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const toCapitalizedList = (arr: string[]): string =>
  arr.map(capitalize).join(', ');
