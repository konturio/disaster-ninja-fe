import { useEffect } from 'react';
import { useAtom } from '@reatom/react-v2';
import { landUser } from '~core/auth';
import { PagesDocument } from '~core/pages';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';

const defaultDocument = [
  {
    type: 'md',
    url: 'about.md',
  },
];

export function AboutPage() {
  useEffect(() => {
    landUser();
  }, []);
  const [featureFlags] = useAtom(featureFlagsAtom);

  const doc =
    featureFlags[FeatureFlag.ABOUT_PAGE]?.configuration?.document ?? defaultDocument;

  return <PagesDocument doc={doc} />;
}
