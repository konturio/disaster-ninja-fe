import { ZoomTo16 } from '@konturio/default-icons';
import { useAction, useAtom } from '@reatom/react-v2';
import { useCallback } from 'react';
import { i18n } from '~core/localization';
import { focusOnGeometry } from '~core/shared_state/currentMapPosition';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { referenceAreaAtom } from '~core/shared_state/referenceArea';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import { REFERENCE_AREA_LOGICAL_LAYER_ID } from '~features/reference_area/constants';
import { LayerActionIcon } from '~components/LayerActionIcon/LayerActionIcon';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';

export function ZoomToControl({ layerState }: { layerState: LogicalLayerState }) {
  const [focusedGeometry] = useAtom(focusedGeometryAtom);
  const [referenceArea] = useAtom(referenceAreaAtom);
  const zoomTo = useAction(focusOnGeometry);

  const geometry =
    layerState.id === FOCUSED_GEOMETRY_LOGICAL_LAYER_ID
      ? focusedGeometry?.geometry
      : layerState.id === REFERENCE_AREA_LOGICAL_LAYER_ID
        ? referenceArea
        : null;

  const onZoom = useCallback(() => {
    if (geometry) {
      zoomTo(geometry);
    }
  }, [geometry, zoomTo]);

  if (!geometry) return null;

  return (
    <LayerActionIcon onClick={onZoom} hint={i18n.t('layer_actions.tooltips.zoom_to')}>
      <ZoomTo16 />
    </LayerActionIcon>
  );
}
