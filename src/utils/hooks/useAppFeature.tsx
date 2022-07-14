import { useEffect, useState } from 'react';
import { featureStatus } from '~core/featureStatus';

export type FeatureInterface = {
  affectsMap: boolean;
  id: string;
  RootComponent?: ({ reportReady }: { reportReady: () => void }) => JSX.Element;
  initFunction?: (reportReady: () => void) => any;
};

type FeatureModule = { featureInterface: FeatureInterface; [key: string]: any };

const NullComponent = () => null;
export function useAppFeature(
  featureModule: Promise<FeatureModule>,
  args: any[] = [],
) {
  const [featureComponent, setFeatureComponent] = useState<JSX.Element>(
    <NullComponent />,
  );
  useEffect(() => {
    (async () => {
      const { affectsMap, RootComponent, initFunction, id } = (
        await featureModule
      ).featureInterface;
      if (!RootComponent && !initFunction)
        return console.error('Module needs to export function or a component');
      const reportReadyness = featureStatus.getReadynessCb(id, affectsMap);

      if (RootComponent) {
        const component = <RootComponent reportReady={reportReadyness} />;
        setFeatureComponent(component);
      } else if (initFunction) {
        initFunction(reportReadyness);
      }
    })();
  }, [featureModule]);

  return featureComponent;
}
