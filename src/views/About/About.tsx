import { useAtom } from '@reatom/react-v2';
import { PagesDocument } from '~core/pages';
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
    // @ts-expect-error ts too picky, most likely this will be refactored
    featureFlags[FeatureFlag.ABOUT_PAGE]?.configuration?.document ?? defaultDocument;

  return <PagesDocument doc={doc} />;
}
