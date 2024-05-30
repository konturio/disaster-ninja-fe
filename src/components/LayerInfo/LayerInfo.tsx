import React, { useMemo } from 'react';
import { TooltipTrigger } from '~components/TooltipTrigger';

export type LayerInfo = {
  name?: string;
  copyrights?: string[];
  description?: string;
};

type LayerInfoProps = {
  meta: LayerInfo[];
  tooltipId?: string;
  className?: string;
};

export const LayerInfo = React.memo(({ meta, tooltipId, className }: LayerInfoProps) => {
  const infoString = useMemo(() => {
    const lines = meta?.map((info) => {
      const name = info?.name && `#### ${info?.name}`;
      const copyrights = info?.copyrights
        ?.filter((v) => v)
        .map((copyright) => `- ${copyright}\n`);
      return name || info.description || copyrights?.length
        ? [name, info.description, copyrights]
        : null;
    });
    return lines
      .flat(2)
      .filter((line) => !!line)
      .join('\n');
  }, [meta]);

  if (infoString) {
    return (
      <TooltipTrigger tipText={infoString} tooltipId={tooltipId} className={className} />
    );
  } else {
    return null;
  }
});

LayerInfo.displayName = 'LayerInfo';
