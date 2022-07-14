import { AppFeature } from '~core/auth/types';
import { SideBar } from './components/SideBar/SideBar';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.SIDE_BAR,
  RootComponent: SideBar,
};
