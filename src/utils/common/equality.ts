type flatObject = Record<string, string | boolean | number | undefined | null>;

export function flatObjectsAreEqual(
  objectA: flatObject | null,
  objectB: flatObject | null,
) {
  if (objectA === null || objectB === null) return false;
  const aKeys = Object.keys(objectA);
  const bKeys = Object.keys(objectB);
  if (!aKeys.length && !bKeys.length) return true;
  if (aKeys.length !== bKeys.length) return false;

  for (let i = 0; i < aKeys.length; i++) {
    const keyToCompare = aKeys[i];
    if (!(keyToCompare in objectB)) return false;
    if (objectA[keyToCompare] !== objectB[keyToCompare]) return false;
  }
  return true;
}
