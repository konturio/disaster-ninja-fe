import React from 'react';
import { Tooltip } from '~components/Tooltip/Tooltip';
import { LogicalLayer } from '~core/logical_layers/createLogicalLayerAtom';

const Component = React.memo(function ({
  layer,
}: {
  layer: LogicalLayer<any>;
}) {
  const copyrights =
    layer.legend && 'copyrights' in layer.legend
      ? layer.legend.copyrights
      : layer.copyrights;

  const description =
    layer.legend && 'description' in layer.legend
      ? layer.legend.description
      : layer.description;

  if (copyrights || description) {
    const tipText = [description, copyrights]
      .flat()
      .filter((line) => line !== undefined)
      .join('\n');
    return <Tooltip tipText={tipText} />;
  } else {
    return null;
  }
});

Component.displayName = 'LayerInfo';

export const LayerInfo = Component;
