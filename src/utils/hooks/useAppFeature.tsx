import { useEffect, useState } from 'react';
import { featureStatus } from '~core/featureStatus';
import type { UserDataModel } from '~core/auth';
import type { AppFeatureType } from '~core/auth/types';

export type FeatureInterface = {
  affectsMap: boolean;
  id: string;
  RootComponent: ({
    reportReady,
  }: {
    reportReady: () => void;
  } & RootFeatureProps) => JSX.Element | null;
  initFunction?: (reportReady: () => void, ...args: any[]) => any;
};

type RootFeatureProps = {
  iconsContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
  [key: string]: any;
};

type FeatureModule = {
  featureInterface: FeatureInterface;
  [key: string]: any;
};

const NullComponent = () => null;

export function useFeatureInitializer(
  userModel: UserDataModel | null | undefined,
) {
  return async (
    featureId: AppFeatureType,
    importAction: Promise<FeatureModule>,
  ) => {
    if (!userModel?.hasFeature(featureId)) return null;
    return (await importAction).featureInterface;
  };
}

export function useAppFeature(
  featureInterfacePromise: Promise<FeatureInterface | null>,
  addedProps: RootFeatureProps = {},
  initArgs: any[] = [],
  updateTrigger?: any,
) {
  const [featureComponent, setFeatureComponent] = useState(<NullComponent />);

  useEffect(() => {
    (async () => {
      const result = await featureInterfacePromise;
      if (result === null) return;

      const { affectsMap, RootComponent, initFunction, id } = result;
      if (!RootComponent && !initFunction)
        return console.error('Module needs to export function or a component');

      const reportReadyness = featureStatus.getReadynessCb(id, affectsMap);

      const component = (
        <RootComponent reportReady={reportReadyness} {...addedProps} />
      );
      setFeatureComponent(component);
      if (initFunction) {
        initFunction(reportReadyness, ...initArgs);
      }
    })();
  }, [updateTrigger]);

  return featureComponent;
}
