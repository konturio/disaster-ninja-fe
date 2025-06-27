import { Virtuoso } from 'react-virtuoso';
import { useMemo } from 'react';
import { InfoErrorOutline16 } from '@konturio/default-icons';
import { Text } from '@konturio/ui-kit';
import { UniLayoutRenderer } from '~components/Uni/Layout/UniLayoutRenderer';
import s from './LayerFeaturesPanel.module.css';
import type { UniLayoutComponentNode } from '~components/Uni/Layout/types';
import type { Feature } from 'geojson';
import type { LayerFeature } from '../../types/layerFeature';

export interface FullStateProps {
  featuresList: LayerFeature[];
  currentFeatureId: number | null;
  listInfoText?: string;
  onClick: (id: number, feature: LayerFeature) => void;
  layout: UniLayoutComponentNode;
}

export function FullState({
  featuresList,
  currentFeatureId,
  listInfoText,
  onClick,
  layout,
}: FullStateProps) {
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
            <button
              key={index}
              type="button"
              onClick={() => onClick(index, feature)}
              className={s.featureButton}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick(index, feature);
                }
              }}
            >
              <UniLayoutRenderer
                node={layout}
                data={{ ...feature, active: index === currentFeatureId }}
              />
            </button>
          )}
        />
        <div className={s.height100vh}></div>
      </div>
    </>
  );
}
