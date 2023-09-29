import { useCallback } from 'react';
import clsx from 'clsx';
import { useAction, useAtom } from '@reatom/react';
import { Panel } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { EditTargets } from '../../constants';
import { currentEditedLayerFeatures } from '../../atoms/currentEditedLayerFeatures';
import { currentSelectedPoint } from '../../atoms/currentSelectedPoint';
import { editTargetAtom } from '../../atoms/editTarget';
import {
  EditFeatureForm,
  EditFeaturePlaceholder,
} from '../EditFeatureForm/EditFeatureForm';
import { editableLayerSettingsAtom } from '../../atoms/editableLayerSettings';
import { createLayerController } from '../../index';
import s from './EditFeaturesPanel.module.css';

export function EditFeaturesPanel() {
  const [selectedFeature, { updateProperties }] = useAtom(currentSelectedPoint);
  const [{ layerId }] = useAtom(editTargetAtom);
  const [layersSettings] = useAtom(editableLayerSettingsAtom);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const disableSideBarControl = useAction(
    () => createLayerController.setState('regular'),
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
      header={String(i18n.t('create_layer.edit_features'))}
      onHeaderClick={onPanelClose}
      className={clsx(s.sidePanel)}
      modal={{
        onModalClick: onPanelClose,
        showInModal: isMobile,
      }}
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
