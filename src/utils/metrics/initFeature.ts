import { featureStatus } from '~core/featureStatus';

export type InitFeatureInterface = {
  affectsMap: boolean;
  id: string;
  initFunction: (reportReady: () => void, ...args: any[]) => void;
};

export type FeatureInitModule = {
  featureInterface: InitFeatureInterface;
  [key: string]: unknown;
};

export const initializeFeature = (
  loader: () => Promise<FeatureInitModule>,
  initFunctionArgs: unknown[] = [],
) =>
  loader().then(({ featureInterface }) => {
    const { affectsMap, id, initFunction } = featureInterface;
    const reportReadyness = featureStatus.getReadynessCb(id, affectsMap);
    initFunction(reportReadyness, ...initFunctionArgs);
  });
