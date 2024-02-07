import { ModalDialog } from '@konturio/ui-kit';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { i18n } from '~core/localization';
import { showModal } from '~core/modal';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { BivariatePanel } from './components';

export const bivariateMatrixControl = toolbar.setupControl({
  id: 'BivariateMatrix',
  type: 'button',
  typeSettings: {
    name: i18n.t('bivariate.panel.header'),
    hint: i18n.t('bivariate.matrix.header.title'),
    icon: 'BivariateMatrix24',
    preferredSize: 'large',
  },
});

bivariateMatrixControl.onStateChange(async (ctx, state) => {
  if (state === 'active') {
    // Logic for when the control is activated
    await showModal(BivariatePanel, {});
    store.dispatch(bivariateMatrixControl.setState('regular'));
  } else {
    // Logic for when the control is deactivated
    store.dispatch(bivariateMatrixControl.setState('regular'));
  }
});

export function initBivariateMatrix() {
  bivariateMatrixControl.init();
}
