import { AppStorage } from '../AppStorage';
import type { CookiePermissionResolveStrategy } from '../types';

export class StrategyStorage {
  private storage = new AppStorage<CookiePermissionResolveStrategy>(
    'kontur_ccs_strategy',
  );

  restoreStrategy() {
    return this.storage.get('strategy');
  }

  persistStrategy(strategy: CookiePermissionResolveStrategy) {
    return this.storage.set('strategy', strategy);
  }
}
