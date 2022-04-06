import { useCallback } from 'react';
import clsx from 'clsx';
import { useAtom } from '@reatom/react';
import { Panel, Text } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { sideControlsBarAtom } from '~core/shared_state';
import { EDIT_LAYER_CONTROL } from '~core/draw_tools/constants';
import { currentSelectedPoint } from '../../atoms/currentSelectedPoint';
import { AddOrEditFeatureForm } from '../AddOrEditFeatureForm/AddOrEditFeatureForm';
import s from './EditFeaturesPanel.module.css';

export function EditFeaturesPanel() {
  const [selectedFeature, { updateProperties }] = useAtom(currentSelectedPoint);
  const onPanelClose = useCallback(() => {
    sideControlsBarAtom.disable.dispatch(EDIT_LAYER_CONTROL);
  }, []);

  const changeProperty = useCallback(
    (key, val) => {
      updateProperties({ [key]: val });
    },
    [updateProperties],
  );

  if (selectedFeature === null) return null;
  const { properties, geometry } = selectedFeature;
  if (properties === null) return null;

  return (
    <Panel
      header={<Text type="heading-l">{i18n.t('Edit feature')}</Text>}
      onClose={onPanelClose}
      className={clsx(s.sidePanel)}
    >
      <div className={s.panelBody}>
        <AddOrEditFeatureForm
          featureProperties={properties}
          geometry={geometry}
          changeProperty={changeProperty}
        />
      </div>
    </Panel>
  );
}
