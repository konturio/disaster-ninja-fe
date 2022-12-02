import { getAbsoluteRoute } from './getAbsoluteRoute';
import history from './history';

export const goTo = (slug: string) => {
  history.push(getAbsoluteRoute(slug) + globalThis.location.search);
};
