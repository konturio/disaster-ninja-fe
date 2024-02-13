import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { mcdaLayerAtom } from './atoms/mcdaLayer';
import { createMCDAConfig } from './mcdaConfig';

export const mcdaControl = toolbar.setupControl({
  id: 'MCDA',
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

export const loadMcdaControl = toolbar.setupControl({
  id: 'LoadMCDA',
  type: 'button',
  typeSettings: {
    name: i18n.t('toolbar.load_mcda'),
    hint: '',
    icon: 'UploadAnalysis16',
    preferredSize: 'large',
  },
});

loadMcdaControl.onStateChange(async (ctx, state) => {
  if (state === 'active') {
  }
});

export function initMCDA() {
  mcdaControl.init();
  loadMcdaControl.init();
}
