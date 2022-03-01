import React from 'react';
import { Tooltip } from '~components/Tooltip/Tooltip';
import { LayerMeta } from '~core/logical_layers/types/meta';

const Component = React.memo(function ({ meta }: { meta: LayerMeta }) {
  const { copyrights, description } = meta;
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
