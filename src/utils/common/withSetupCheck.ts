/* Check that setup method was celled */
export function withSetupCheck<T extends { setup: (cfg: any) => void }, A extends any[]>(
  cls: new (...args: A) => T,
  ...args: A
) {
  if (!('setup' in cls.prototype)) {
    throw Error('Class must have setup method');
  }

  const instance = new cls(...args);
  let setupDone = false;

  const proxy = new Proxy(instance, {
    get(target, prop, receiver) {
      if (prop === 'setup') {
        setupDone = true;
        return Reflect.get(target, 'setup', receiver);
      } else {
        if (setupDone) {
          return Reflect.get(target, prop, receiver);
        } else {
          throw Error(`You must call ${instance.constructor.name}.setup() before usage`);
        }
      }
    },
  });
  return proxy;
}
