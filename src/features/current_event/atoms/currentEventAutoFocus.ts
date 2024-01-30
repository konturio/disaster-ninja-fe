import { atom } from '@reatom/core';
import { currentMapPositionAtom } from '~core/shared_state';
import { currentMapAtom } from '~core/shared_state';
import { configRepo } from '~core/config';
import { getCameraForGeometry } from '~utils/map/cameraForGeometry';
import { scheduledAutoFocus } from '~core/shared_state/currentEvent';
import type { EventWithGeometry } from '~core/types';
import type { AtomSelfBinded } from '@reatom/core-v2';

export function autoFocusToGeometry(
  currentEventGeometryAtom: AtomSelfBinded<
    EventWithGeometry | null,
    NonNullable<unknown>
  >,
) {
  const lastEventGeometryAtom = atom<EventWithGeometry | null>(null, 'lastEventGeometry');
  currentEventGeometryAtom.v3atom.onChange((ctx, currentEventGeometry) => {
    const lastEventGeometry = ctx.get(lastEventGeometryAtom);
    if (currentEventGeometry === null) return;
    const autoFocusWasScheduled = ctx.get(scheduledAutoFocus.v3atom);
    if (autoFocusWasScheduled === false) return;
    if (currentEventGeometry?.eventId !== lastEventGeometry?.eventId) {
      const map = ctx.get(currentMapAtom.v3atom);
      const geometryCamera = getCameraForGeometry(currentEventGeometry.geojson, map);
      if (
        typeof geometryCamera === 'object' &&
        typeof geometryCamera.zoom === 'number' &&
        geometryCamera.center &&
        'lat' in geometryCamera.center &&
        'lng' in geometryCamera.center
      ) {
        const maxZoom = configRepo.get().autofocusZoom;
        const pos = {
          zoom: Math.min(geometryCamera.zoom || maxZoom, maxZoom),
          ...geometryCamera.center,
        };
        ctx.schedule(() => {
          scheduledAutoFocus.setFalse.v3action(ctx);
          currentMapPositionAtom.setCurrentMapPosition.v3action(ctx, pos);
        });
      }
    }
    lastEventGeometryAtom(ctx, currentEventGeometry);
  });
}
