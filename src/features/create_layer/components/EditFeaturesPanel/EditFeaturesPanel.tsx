import { useCallback } from 'react';
import clsx from 'clsx';
import { useAction, useAtom } from '@reatom/react';
import { Panel, Text } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { sideControlsBarAtom } from '~core/shared_state';
import { CREATE_LAYER_CONTROL_ID, EditTargets } from '../../constants';
import { currentEditedLayerFeatures } from '../../atoms/currentEditedLayerFeatures';
import { currentSelectedPoint } from '../../atoms/currentSelectedPoint';
import { editTargetAtom } from '../../atoms/editTarget';
import {
  EditFeatureForm,
  EditFeaturePlaceholder,
} from '../EditFeatureForm/EditFeatureForm';
import s from './EditFeaturesPanel.module.css';
import { editableLayerSettingsAtom } from '../../atoms/editableLayerSettings';

export function EditFeaturesPanel() {
  const [selectedFeature, { updateProperties }] = useAtom(currentSelectedPoint);
  const [{ layerId }] = useAtom(editTargetAtom);
  const [layersSettings] = useAtom(editableLayerSettingsAtom);
  const disableSideBarControl = useAction(
    () => sideControlsBarAtom.disable(CREATE_LAYER_CONTROL_ID),
    [],
  );
  const disableEditing = useAction(
    () => editTargetAtom.set({ type: EditTargets.none }),
    [],
  );
  const onPanelClose = useCallback(() => {
    disableSideBarControl();
    disableEditing();
  }, [disableSideBarControl, disableEditing]);

  const saveFeatures = useAction(currentEditedLayerFeatures.save);
  const onSave = useCallback(() => {
    saveFeatures();
    onPanelClose();
  }, [onPanelClose, saveFeatures]);

  const changeProperty = useCallback(
    (key, val) => {
      updateProperties({ [key]: val });
    },
    [updateProperties],
  );
  if (!layerId) return null;
  const settings = layersSettings?.get(layerId);
  if (!settings) return null;

  return (
    <Panel
      header={<Text type="heading-l">{i18n.t('Edit features')}</Text>}
      onClose={onPanelClose}
      className={clsx(s.sidePanel)}
    >
      <div className={s.panelBody}>
        {selectedFeature?.properties ? (
          <EditFeatureForm
            featureProperties={selectedFeature.properties}
            fieldsSettings={settings}
            geometry={selectedFeature.geometry}
            changeProperty={changeProperty}
            onSave={onSave}
          />
        ) : (
          <EditFeaturePlaceholder />
        )}
      </div>
    </Panel>
  );
}
