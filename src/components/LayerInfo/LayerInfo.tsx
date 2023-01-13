import React from 'react';
import { TooltipTrigger } from '~components/TooltipTrigger';
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
    return <TooltipTrigger tipText={tipText} tooltipId={tooltipId} />;
  } else {
    return null;
  }
});

LayerInfo.displayName = 'LayerInfo';
