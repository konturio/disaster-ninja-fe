import { createAtom } from '@reatom/core-v2';
import { userWasLandedAtom } from '~core/auth/atoms/userWasLanded';
import history from '../history';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import { availableRoutesAtom } from './availableRoutes';

export const showAboutForNewUsersAtom = createAtom(
  {
    userWasLandedAtom,
    availableRoutesAtom,
    showAboutForNewUsers: () => null,
  },
  ({ get, schedule, onAction }) => {
    onAction('showAboutForNewUsers', () => {
      const userWasLanded = get('userWasLandedAtom');
      if (userWasLanded === 'no') {
        const routesConfig = get('availableRoutesAtom');
        if (!routesConfig) return;
        const greetingsRoute = routesConfig.routes.find((r) => r.showForNewUsers);

        if (!greetingsRoute) return;
        schedule(() => {
          history.push(
            getAbsoluteRoute(greetingsRoute.slug) + globalThis.location.search,
          );
        });
      }
    });
  },
  'showAboutForNewUsersAtom',
);
