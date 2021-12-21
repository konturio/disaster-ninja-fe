import { useContext } from 'react';
import { useAction, useAtom } from '@reatom/react';
import { LogicalLayersRegistryContext } from '../LayersTree/LayersTree';
import { LayerControl } from '../LayerControl/LayerControl';
import { Tooltip } from '~components/Tooltip/Tooltip';

function LayerInfo({
  copyrights,
  description,
}: {
  copyrights?: string;
  description?: string;
}) {
  if (copyrights || description) {
    return <Tooltip tipText={[description, copyrights].join('\n')} />;
  } else {
    return null;
  }
}

export function Layer({
  layerAtomId,
  mutuallyExclusive,
}: {
  layerAtomId: string;
  mutuallyExclusive: boolean;
}) {
  const registry = useContext(LogicalLayersRegistryContext);
  const [layer, layerActions] = useAtom(registry[layerAtomId]);
  const onChange = useAction(
    () => (layer.isMounted ? layerActions.unmount() : layerActions.mount()),
    [layer.isMounted],
  );
  return (
    <LayerControl
      isError={layer.isError}
      isLoading={layer.isLoading}
      onChange={onChange}
      enabled={layer.isMounted}
      hidden={!layer.isVisible}
      name={layer.layer.name || layer.id}
      inputType={mutuallyExclusive ? 'radio' : 'checkbox'}
      controls={[
        <LayerInfo
          key={layer.id}
          copyrights={layer.layer.copyright}
          description={layer.layer.description}
        />,
      ]}
    />
  );
}
