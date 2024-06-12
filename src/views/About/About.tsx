import { useAtom } from '@reatom/react-v2';
import { PagesDocument } from '~core/pages';
import { configRepo } from '~core/config';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';

const defaultDocument = [
  {
    type: 'md',
    url: 'about.md',
  },
];

export function AboutPage() {
  const [featureFlags] = useAtom(featureFlagsAtom);

  const doc =
    featureFlags[FeatureFlag.ABOUT_PAGE]?.configuration?.document ?? defaultDocument;

  return <PagesDocument doc={doc} />;
}
