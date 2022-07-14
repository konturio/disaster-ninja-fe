import { AppHeader } from '@konturio/ui-kit';
import { useEffect } from 'react';
import { AppFeature } from '~core/auth/types';
import type { ReactNode} from 'react';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.HEADER,
  // @ts-ignore
  // todo improve app metrics #11232
  RootComponent: ({
    reportReady,
    title,
    logo,
    content,
  }: {
    reportReady: () => void;
    title: string;
    logo: JSX.Element | undefined;
    content?: ReactNode;
  }) => {
    useEffect(() => reportReady(), []);

    return (
      <AppHeader
        title={title}
        logo={logo}
        afterChatContent={content}
      ></AppHeader>
    );
  },
};
