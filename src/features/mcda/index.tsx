import { i18n } from '~core/localization';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { mcdaLayerAtom } from './atoms/mcdaLayer';
import { promptMCDAConfig } from './prompt';

export const mcdaControl = toolbar.setupControl({
  id: 'MCDA',
  type: 'button',
  typeSettings: {
    name: i18n.t('mcda.name'),
    hint: i18n.t('mcda.title'),
    icon: '',
    preferredSize: 'small',
  },
});

mcdaControl.onStateChange(async (ctx, state) => {
  if (state === 'active') {
    const mcdaConfig = await promptMCDAConfig();
    if (mcdaConfig) {
      store.dispatch([
        mcdaLayerAtom.calcMCDA(mcdaConfig),
        mcdaControl.setState('regular'),
      ]);
    } else {
      store.dispatch(mcdaControl.setState('regular'));
    }
  }
});

export function initMCDA() {
  mcdaControl.init();
}
