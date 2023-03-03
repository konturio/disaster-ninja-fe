const set = new WeakSet();
export const once = <X, T extends () => X>(cb: T): X | undefined => {
  if (set.has(cb)) return undefined;
  set.add(cb);
  return cb();
};
