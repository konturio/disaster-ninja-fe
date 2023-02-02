import { appConfig } from '~core/app_config';
import { featureFlagsAtom } from '~core/shared_state';
import { createBooleanAtom } from '~utils/atoms';
import { store } from '~core/store/store';

export const featuresWereSetAtom = createBooleanAtom(false, 'featuresWereSetAtom');

export function setFeatures(value: Record<string, boolean | object>) {
  store.dispatch([featureFlagsAtom.set(value), featuresWereSetAtom.setTrue()]);
}
