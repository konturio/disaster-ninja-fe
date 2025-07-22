import { Virtuoso } from 'react-virtuoso';
import { useMemo } from 'react';
import { InfoErrorOutline16 } from '@konturio/default-icons';
import { Text } from '@konturio/ui-kit';
import { LayerFeaturesCard } from '../LayerFeaturesCard';
import s from './LayerFeaturesPanel.module.css';
import type { FeaturesPanelItem } from './types';

export function FullState({
  featuresList,
  currentFeatureId,
  listInfoText,
  onClick,
  layout,
}: {
  featuresList: FeaturesPanelItem[];
  currentFeatureId: number | null;
  listInfoText?: string;
  onClick: (id: number, feature: FeaturesPanelItem) => void;
  layout: any;
}) {
  const currentFeatureIndex = useMemo(() => {
    if (!currentFeatureId) return 0;
    if (featuresList === null || featuresList.length === 0) return 0;
    const index = featuresList.findIndex((d) => d.id === currentFeatureId);
    return Math.max(index, 0);
  }, [currentFeatureId, featuresList]);

  return (
    <>
      {listInfoText && (
        <div className={s.shield}>
          <InfoErrorOutline16 />
          <Text type="caption">{listInfoText}</Text>
        </div>
      )}
      <div className={s.scrollable}>
        <Virtuoso
          data={featuresList}
          initialTopMostItemIndex={currentFeatureIndex}
          itemContent={(index, feature) => (
            <LayerFeaturesCard
              key={feature.id}
              feature={feature}
              isActive={index === currentFeatureId}
              onClick={() => onClick(index, feature)}
              layout={layout}
            />
          )}
        />
        <div className={s.height100vh}></div>
      </div>
    </>
  );
}
