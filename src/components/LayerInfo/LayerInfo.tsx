import React from 'react';
import { Tooltip } from '~components/Tooltip';
import type { LayerMeta } from '~core/logical_layers/types/meta';

type LayerInfoProps = {
  meta: LayerMeta;
  tooltipId?: string;
};

export const LayerInfo = React.memo(({ meta, tooltipId }: LayerInfoProps) => {
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

LayerInfo.displayName = 'LayerInfo';
