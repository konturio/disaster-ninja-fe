import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { mcdaLayerAtom } from './atoms/mcdaLayer';
import { createMCDAConfig } from './mcdaConfig';
import { MCDA_CONTROL_ID, UPLOAD_MCDA_CONTROL_ID } from './constants';
import { askMcdaJSONFile } from './openMcdaFile';

export const mcdaControl = toolbar.setupControl({
  id: MCDA_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: i18n.t('mcda.name'),
    hint: i18n.t('mcda.title'),
    icon: 'Layers24',
    preferredSize: 'large',
  },
});

mcdaControl.onStateChange(async (ctx, state) => {
  if (state === 'active') {
    const mcdaConfig = await createMCDAConfig();
    if (mcdaConfig) {
      store.dispatch([
        mcdaLayerAtom.createMCDALayer(mcdaConfig),
        mcdaControl.setState('regular'),
      ]);
    } else {
      store.dispatch(mcdaControl.setState('regular'));
    }
  }
});

export const uploadMcdaControl = toolbar.setupControl({
  id: UPLOAD_MCDA_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: i18n.t('toolbar.upload_mcda'),
    hint: '',
    icon: 'UploadAnalysis16',
    preferredSize: 'large',
    onRef: (el) => {
      /**
       * In webkit you can't use additional function wrapper including useCallback
       * because it's disable file upload popup.
       */
      el?.addEventListener('click', (e) => uploadOnClick());
    },
  },
});

function uploadOnClick() {
  askMcdaJSONFile((mcdaConfig) => {
    if (mcdaConfig) {
      store.dispatch([
        mcdaLayerAtom.createMCDALayer(mcdaConfig),
        mcdaControl.setState('regular'),
      ]);
    } else {
      store.dispatch(mcdaControl.setState('regular'));
    }
  });
}

uploadMcdaControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    store.dispatch(uploadMcdaControl.setState('regular'));
  }
});

export function initMCDA() {
  mcdaControl.init();
  uploadMcdaControl.init();
}
