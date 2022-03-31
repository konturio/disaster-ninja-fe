import s from './FeaturePanel.module.css';
import { Panel, Text } from '@k2-packages/ui-kit';
import clsx from 'clsx';
import { TranslationService as i18n } from '~core/localization';
import { useCallback } from 'react';
import { useAtom } from '@reatom/react';
import { sideControlsBarAtom } from '~core/shared_state';
import { EDIT_LAYER_CONTROL } from '~core/draw_tools/constants';
import { featurePanelAtom } from '~features/create_layer/_atoms/featurePanel';
import { AddOrEditFeature } from '../AddOrEditFeature/AddOrEditFeature';

export function FeaturePanel() {
  const [
    { featurePanelMode, geometry, ...featureProperties },
    { changeProperty },
  ] = useAtom(featurePanelAtom);

  const onPanelClose = useCallback(() => {
    sideControlsBarAtom.disable.dispatch(EDIT_LAYER_CONTROL);
  }, []);

  return (
    <Panel
      header={<Text type="heading-l">{i18n.t(String(featurePanelMode))}</Text>}
      onClose={onPanelClose}
      className={clsx(
        s.sidePanel,
        featurePanelMode && s.show,
        !featurePanelMode && s.hide,
      )}
    >
      <div className={s.panelBody}>
        <AddOrEditFeature
          featureProperties={featureProperties}
          geometry={geometry}
          changeProperty={changeProperty}
        />
      </div>
    </Panel>
  );
}
