import { getAbsoluteRoute } from './getAbsoluteRoute';
import { routerInstance } from './components/Router';

export const goTo = (slug: string) => {
  routerInstance.navigate(getAbsoluteRoute(slug));
  // routerLocationAtom(store.v3ctx, getAbsoluteRoute(slug));
  // history.push(getAbsoluteRoute(slug) + globalThis.location.search);
};
