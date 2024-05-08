import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { updateReferenceArea } from '~core/api/features';
import { SAVE_AS_REFERENCE_AREA_CONTROL_ID } from './constants';
import { initReferenceAreaLayer } from './initReferenceAreaLayer';
import { referenceAreaAtom } from './atoms/referenceAreaAtom';
import type { FocusedGeometry } from '~core/focused_geometry/types';
import type { Unsubscribe } from '@reatom/core';

let focusedGeometryUnsubscribe: Unsubscribe | null;

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
  const geometry = focusedGeometryAtom.getState()?.geometry;
  if (geometry) {
    await updateReferenceArea(geometry);
    store.dispatch(referenceAreaAtom.setReferenceArea(geometry));
  }
}

function focusedGeometryExists(focusedGeometryState: FocusedGeometry | null): boolean {
  if (
    focusedGeometryState?.geometry?.type === 'FeatureCollection' &&
    focusedGeometryState.geometry.features?.length
  ) {
    return true;
  }
  return false;
}

saveAsReferenceAreaControl.onStateChange(async (ctx, state) => {
  if (state === 'regular') {
    if (!focusedGeometryExists(focusedGeometryAtom.getState())) {
      store.dispatch([saveAsReferenceAreaControl.setState('disabled')]);
    }
  }
  if (state === 'active') {
    saveFocusedGeometryAsReferenceArea();
    store.dispatch([saveAsReferenceAreaControl.setState('regular')]);
  }
});

saveAsReferenceAreaControl.onInit(() => {
  if (!focusedGeometryExists(focusedGeometryAtom.getState())) {
    store.dispatch([saveAsReferenceAreaControl.setState('disabled')]);
  }
  focusedGeometryUnsubscribe = focusedGeometryAtom.v3atom.onChange((ctx, newState) => {
    if (focusedGeometryExists(newState)) {
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
