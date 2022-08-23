import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const INIT_FEATURES: GeoJSON.GeoJSON = {
  type: 'FeatureCollection',
  features: [],
};

export function useDrawings() {
  const { t } = useTranslation();
  const [drawings, setDrawings] = useState<GeoJSON.GeoJSON>(INIT_FEATURES);
  const onEdit = useCallback(
    ({ updatedData, editType, editContext }) => {
      switch (editType) {
        case 'addTentativePosition':
          // clear previous drawings
          if (updatedData.features && updatedData.features.length > 0) {
            setDrawings(INIT_FEATURES);
          }
          break;
        case 'addFeature':
          setDrawings(updatedData);
          break;
        case 'skipSelfIntersection':
          alert(t('drawings.self_directions_not_supported'));
          break;
        default:
          break;
      }
    },
    [setDrawings, t],
  );

  return [drawings, setDrawings, onEdit] as const;
}
