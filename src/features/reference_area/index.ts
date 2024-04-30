import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { SAVE_AS_REFERENCE_AREA_CONTROL_ID } from './constants';
import type { Unsubscribe } from '@reatom/core';

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

saveAsReferenceAreaControl.onStateChange(async (ctx, state) => {
  if (state === 'active') {
    store.dispatch([saveAsReferenceAreaControl.setState('regular')]);
  }
});

let focusedGeometryUnsubscribe: Unsubscribe | null;

saveAsReferenceAreaControl.onInit(() => {
  const focusedGeometryInitialState = focusedGeometryAtom.getState();
  if (
    !(focusedGeometryInitialState?.geometry?.type === 'FeatureCollection') ||
    !focusedGeometryInitialState.geometry.features?.length
  ) {
    store.dispatch([saveAsReferenceAreaControl.setState('disabled')]);
  }
  focusedGeometryUnsubscribe = focusedGeometryAtom.v3atom.onChange((ctx, newState) => {
    if (newState?.geometry?.type === 'FeatureCollection') {
      if (newState.geometry.features?.length) {
        store.dispatch([saveAsReferenceAreaControl.setState('regular')]);
      } else {
        store.dispatch([saveAsReferenceAreaControl.setState('disabled')]);
      }
    }
  });
});

saveAsReferenceAreaControl.onRemove(() => {
  focusedGeometryUnsubscribe?.();
  focusedGeometryUnsubscribe = null;
});

export function initReferenceArea() {
  saveAsReferenceAreaControl.init();
}
