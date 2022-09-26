function recursiveCopy(src) {
  const target = Array.isArray(src) ? [] : {};
  for (const prop in src) {
    const value = src[prop];
    if (value && typeof value === 'object') {
      target[prop] = recursiveCopy(value);
    } else {
      target[prop] = value;
    }
  }
  return target;
}

export const deepCopy = window.structuredClone ?? recursiveCopy;
