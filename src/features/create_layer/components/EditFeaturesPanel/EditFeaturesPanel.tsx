import { useCallback } from 'react';
import clsx from 'clsx';
import { useAtom } from '@reatom/react';
import { Panel, Text } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { sideControlsBarAtom } from '~core/shared_state';
import { EDIT_LAYER_CONTROL } from '~core/draw_tools/constants';
import { featurePanelControllerAtom } from '../../atoms/featurePanelController';
import { AddOrEditFeatureForm } from '../AddOrEditFeatureForm/AddOrEditFeatureForm';
import s from './EditFeaturesPanel.module.css';

export function EditFeaturesPanel() {
  return null;

  const [
    { featurePanelMode, geometry, ...featureProperties },
    { changeProperty },
  ] = useAtom(featurePanelControllerAtom);

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
        <AddOrEditFeatureForm
          featureProperties={featureProperties}
          geometry={geometry}
          changeProperty={changeProperty}
        />
      </div>
    </Panel>
  );
}
