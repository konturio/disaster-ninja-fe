import { cloneElement } from 'react';
import { featureStatus } from '~core/featureStatus';

export type FeatureInterface<Args = any> = {
  initialize: (reportReady: () => void, arg?: Args) => any;
  affectsApplicationMap: boolean;
};
type Payload = any[] | undefined;

export function initFeature(
  featureInterface: FeatureInterface<Payload>,
  featureId: string,
  payloadArgs?: Payload,
) {
  const { initialize, affectsApplicationMap } = featureInterface;
  const reportReadyness = featureStatus.getReadynessCb(
    featureId,
    affectsApplicationMap,
  );
  payloadArgs
    ? initialize(reportReadyness, ...payloadArgs)
    : initialize(reportReadyness);
}

export function featureWrap(
  Component: JSX.Element,
  featureId: string,
  affectsApplicationMap: boolean,
): React.ReactElement<{ reportReady: () => void }> {
  if (!Component.props.reportReady)
    console.error('define reportReady property for ' + featureId);
  const reportReadyness = featureStatus.getReadynessCb(
    featureId,
    affectsApplicationMap,
  );
  return cloneElement(Component, { reportReady: reportReadyness });
}

// couldn't implement
export type FeatureComponentInterface = {
  initialize(reportReady: () => void): JSX.Element;
  affectsApplicationMap: boolean;
};
export function loadFeatureComponent(
  featureInterface: FeatureComponentInterface,
  featureId: string,
) {
  const { initialize, affectsApplicationMap } = featureInterface;
  const reportReadyness = featureStatus.getReadynessCb(
    featureId,
    affectsApplicationMap,
  );
  return () => initialize(reportReadyness);
}
