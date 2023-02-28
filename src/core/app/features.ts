import { featureFlagsAtom } from '~core/shared_state';
import { createBooleanAtom } from '~utils/atoms';
import { store } from '~core/store/store';
import type { AppFeatureType } from '~core/auth/types';

export const featuresWereSetAtom = createBooleanAtom(false, 'featuresWereSetAtom');

export function setFeatures(value: Record<AppFeatureType, boolean | object>) {
  store.dispatch([featureFlagsAtom.set(value), featuresWereSetAtom.setTrue()]);
}
