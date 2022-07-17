import { lazy } from 'react';
import { featureStatus } from '~core/featureStatus';

export type RootFeatureProps = {
  iconsContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
  [key: string]: unknown;
};

export type FeatureInterface = {
  affectsMap: boolean;
  id: string;
  initFunction?: (reportReady: () => void, ...args: unknown[]) => void;
  rootComponentWrap: (
    reportReady: () => void,
    addedProps: { [key: string]: unknown },
  ) => ({}: RootFeatureProps) => JSX.Element;
};

export type FeatureImportModule = {
  featureInterface: FeatureInterface;
  [key: string]: unknown;
};

export const lazyFeatureLoad = (
  loader: () => Promise<FeatureImportModule>,
  props: { [key: string]: unknown } = {},
  initFunctionArgs: unknown[] = [],
) =>
  lazy(() =>
    loader().then(({ featureInterface }) => {
      const { rootComponentWrap, affectsMap, id, initFunction } =
        featureInterface;
      const reportReadyness = featureStatus.getReadynessCb(id, affectsMap);
      initFunction?.(reportReadyness, ...initFunctionArgs);
      const component = rootComponentWrap(reportReadyness, props);
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        default: component as any as React.ComponentType<any>,
      };
    }),
  );
