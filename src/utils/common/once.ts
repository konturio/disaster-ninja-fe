export const once = <T extends (...args: any) => any>(cb: T) => {
  let called = false;
  return (...args: Parameters<T>) => {
    if (called) return undefined;
    called = true;
    // @ts-ignore
    return cb(...args);
  };
};
