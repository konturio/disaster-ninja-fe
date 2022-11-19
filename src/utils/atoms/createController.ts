import core from '~core/index';

type Fn<Args extends any[] = any[], Return = any> = (...a: Args) => Return;

export function createFeatureController<T extends Record<string, Fn>>(actions: T) {
  return Object.entries(actions).reduce((acc, [actionName, actionCreator]) => {
    // @ts-ignore - ts says string can be string
    acc[actionName] = (payload) => {
      const action = actionCreator(payload);
      if (typeof action === 'function') {
        action(core.store.dispatch);
      } else {
        core.store.dispatch(action);
      }
    };
    return acc;
  }, {} as T);
}

const example = createFeatureController({
  foo: () => null,
  bar: (a: string) => a,
});
