import { createAtom } from '@reatom/core';
import { userWasLandedAtom } from '~core/auth/atoms/userWasLanded';
import history from '../history';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import { availableRoutesAtom } from './availableRoutes';

export const showAboutForNewUsersAtom = createAtom(
  {
    userWasLandedAtom,
    availableRoutesAtom,
  },
  ({ get }) => {
    const userWasLanded = get('userWasLandedAtom');
    if (userWasLanded === 'no') {
      const routesConfig = get('availableRoutesAtom');
      if (!routesConfig) return;
      const greetingsRoute = routesConfig.routes.find((r) => r.showForNewUsers);
      if (!greetingsRoute) return;
      history.push(getAbsoluteRoute(greetingsRoute.slug));
    }
  },
);
