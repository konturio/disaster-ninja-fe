import React from 'react';
import { Tooltip } from '~components/Tooltip';
import type { LayerMeta } from '~core/logical_layers/types/meta';

type LayerInfoProps = {
  meta: LayerMeta;
  tooltipId?: string;
};

const Component = React.memo(function ({ meta, tooltipId }: LayerInfoProps) {
  const { copyrights, description } = meta;
  if (copyrights || description) {
    const tipText = [description, copyrights]
      .flat()
      .filter((line) => line !== undefined)
      .join('\n');
    return <Tooltip tipText={tipText} tooltipId={tooltipId} />;
  } else {
    return null;
  }
});

Component.displayName = 'LayerInfo';

export const LayerInfo = Component;
