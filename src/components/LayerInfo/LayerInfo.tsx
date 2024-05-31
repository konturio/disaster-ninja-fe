import React, { useMemo } from 'react';
import { TooltipTrigger } from '~components/TooltipTrigger';

export type LayerInfo = {
  name?: string;
  copyrights?: string[];
  description?: string;
};

type LayerInfoProps = {
  layersInfo: LayerInfo[];
  tooltipId?: string;
  className?: string;
};

export const LayerInfo = React.memo(
  ({ layersInfo, tooltipId, className }: LayerInfoProps) => {
    const infoString = useMemo(() => {
      const lines = layersInfo?.map((info) => {
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
    }, [layersInfo]);

    if (infoString) {
      return (
        <TooltipTrigger
          tipText={infoString}
          tooltipId={tooltipId}
          className={className}
        />
      );
    } else {
      return null;
    }
  },
);

LayerInfo.displayName = 'LayerInfo';
