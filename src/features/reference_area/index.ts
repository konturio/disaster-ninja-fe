import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { focusedGeometryAtom as focusedGeometryAtomV2 } from '~core/focused_geometry/model';
import { updateReferenceArea } from '~core/api/features';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { setReferenceArea } from '~core/shared_state/referenceArea';
import { SAVE_AS_REFERENCE_AREA_CONTROL_ID } from './constants';
import { initReferenceAreaLayer } from './initReferenceAreaLayer';
import type { FocusedGeometry } from '~core/focused_geometry/types';
import type { Unsubscribe } from '@reatom/core';

let focusedGeometryUnsubscribe: Unsubscribe | null;

const focusedGeometryAtom = focusedGeometryAtomV2.v3atom;

export const saveAsReferenceAreaControl = toolbar.setupControl({
  id: SAVE_AS_REFERENCE_AREA_CONTROL_ID,
  type: 'button',
  borrowMapInteractions: true,
  typeSettings: {
    name: i18n.t('reference_area.save_as_reference_area'),
    hint: i18n.t('reference_area.save_as_reference_area'),
    icon: 'Reference16',
    preferredSize: 'large',
  },
});

async function saveFocusedGeometryAsReferenceArea() {
  const geometryState = store.v3ctx.get(focusedGeometryAtom);
  if (focusedGeometryExists(geometryState)) {
    const geometry = (geometryState as FocusedGeometry)?.geometry;
    await updateReferenceArea(geometry);
    setReferenceArea(store.v3ctx, geometry);
    notificationServiceInstance.success(
      {
        title: i18n.t('reference_area.selected_area_saved_as_reference_area'),
      },
      2,
    );
  }
}

function focusedGeometryExists(focusedGeometryState: FocusedGeometry | null): boolean {
  if (
    (focusedGeometryState?.geometry?.type === 'FeatureCollection' &&
      focusedGeometryState.geometry.features?.length) ||
    focusedGeometryState?.geometry?.type === 'Feature'
  ) {
    return true;
  }
  return false;
}

saveAsReferenceAreaControl.onStateChange(async (ctx, state) => {
  if (state === 'regular') {
    // this case happens when another control sets this one into regular state, but focused geometry is empty
    if (!focusedGeometryExists(store.v3ctx.get(focusedGeometryAtom))) {
      store.dispatch([saveAsReferenceAreaControl.setState('disabled')]);
    }
  }
  if (state === 'active') {
    saveFocusedGeometryAsReferenceArea();
    store.dispatch([saveAsReferenceAreaControl.setState('regular')]);
  }
});

saveAsReferenceAreaControl.onInit(() => {
  focusedGeometryUnsubscribe = store.v3ctx.subscribe(focusedGeometryAtom, (geometry) => {
    if (focusedGeometryExists(geometry)) {
      store.dispatch([saveAsReferenceAreaControl.setState('regular')]);
    } else {
      store.dispatch([saveAsReferenceAreaControl.setState('disabled')]);
    }
  });
});

saveAsReferenceAreaControl.onRemove(() => {
  focusedGeometryUnsubscribe?.();
  focusedGeometryUnsubscribe = null;
});

export function initReferenceArea() {
  saveAsReferenceAreaControl.init();
  initReferenceAreaLayer();
}
