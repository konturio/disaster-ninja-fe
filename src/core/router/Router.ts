import history from './history';
import { createRoutes } from './routes';
import * as atoms from './atoms';
import type { AppConfigParsedI, I18n } from '..';
import type { AppRouterConfig } from './types';
import type { AppFeatures } from '~core/app_features';

export class Router {
  history = history;
  routesConfig!: AppRouterConfig;
  config!: AppConfigParsedI;
  atoms!: {
    availableRoutesAtom: atoms.AvailableRoutesAtom;
    currentLocationAtom: atoms.CurrentLocationAtom;
    currentRouteAtom: atoms.CurrentRouteAtom;
  };

  init({
    config,
    i18n,
    features,
  }: {
    config: AppConfigParsedI;
    i18n: I18n;
    features: AppFeatures;
  }) {
    this.config = config;
    this.routesConfig = createRoutes(i18n);
    const availableRoutesAtom = atoms.createAvailableRoutesAtom(
      this.routesConfig,
      features,
    );
    const currentLocationAtom = atoms.createCurrentLocationAtom(this.history);
    const currentRouteAtom = atoms.createCurrentRouteAtom({
      availableRoutesAtom,
      currentLocationAtom,
      getAbsoluteRoute: this.getAbsoluteRoute,
    });

    this.atoms = {
      availableRoutesAtom,
      currentLocationAtom,
      currentRouteAtom,
    };
    return this;
  }

  showIntro() {
    const greetingsRoute = this.routesConfig.routes.find((r) => r.showForNewUsers);
    if (!greetingsRoute) return;
    history.push(this.getAbsoluteRoute(greetingsRoute.slug));
  }

  getAbsoluteRoute(slug: string) {
    return this.config.baseUrl + slug;
  }

  toHomePage() {
    this.history.push(this.routesConfig.defaultRoute);
  }
}
