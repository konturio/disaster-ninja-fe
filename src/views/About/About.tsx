import { PagesDocument } from '~core/pages';
import { configRepo } from '~core/config';
import { FeatureFlag } from '~core/shared_state';

const defaultDocument = [
  {
    type: 'md',
    url: 'about.md',
  },
];

export function AboutPage() {
  const doc =
    // @ts-expect-error ts too picky, most likely this will be refactored
    configRepo.get().features[FeatureFlag.ABOUT_PAGE]?.configuration?.document ??
    defaultDocument;

  return <PagesDocument doc={doc} />;
}
