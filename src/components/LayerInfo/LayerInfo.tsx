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
    /* for each item of layersInfo, add lines in order:
      - name
      - description
      - copyrights (as unordered list)
    */
    const lines = layersInfo?.map((info) => {
      const name = info?.name && `#### ${info?.name}`;
      const copyrights = info?.copyrights
        ?.filter((v) => v)
        .map((copyright) => `- ${copyright}\n`);
      return name || info.description || copyrights?.length
        ? [name, info.description, copyrights]
        : null;
    });
    const infoString = lines
      .flat(2)
      .filter((line) => line)
      .join('\n');

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
