import React from 'react';
import { InfoPopover } from '~components/Overlays';

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

export const LayerInfo = React.memo(({ layersInfo, className }: LayerInfoProps) => {
  /* for each item of layersInfo, add lines in order:
      - name
      - description
      - copyrights (as unordered list)
    */
  const lines = layersInfo?.map((info) => {
    const name = info?.name && `#### ${info.name.trim()}`;
    const description = info.description?.replaceAll(/\n\s+/g, '\n').trim();
    const copyrights = info?.copyrights
      ?.filter(Boolean)
      .map((copyright) => `- ${copyright.trim()}`);
    return name || description || copyrights?.length
      ? [name, description, copyrights]
      : null;
  });

  const infoString = lines
    .flat(2)
    .filter(Boolean)
    .join('\n\n')
    .trim()
    .replace(/\n{3,}/g, '\n\n'); // Limit consecutive newlines to 2

  if (infoString) {
    return <InfoPopover content={infoString} className={className} />;
  } else {
    return null;
  }
});

LayerInfo.displayName = 'LayerInfo';
