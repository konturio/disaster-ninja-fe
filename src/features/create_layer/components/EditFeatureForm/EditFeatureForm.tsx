import { ChangeEvent } from 'react';
import { Geometry } from 'geojson';
import { Label } from '~components/Label/Label';
import { translationService as i18n } from '~core/index';
import { Button, Input, Text } from '@k2-packages/ui-kit';
import { EditableLayerSettings } from '../../types';
import s from './EditFeatureForm.module.css';

type EditFeatureFormProps = {
  geometry: Geometry | null;
  fieldsSettings: EditableLayerSettings;
  featureProperties: { [key: string]: string };
  changeProperty: (property: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

function ButtonPanel({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className={s.buttonsContainer}>
      <Button onClick={onSave} className={s.saveBtn}>
        {i18n.t('Save Features')}
      </Button>
      <Button onClick={onCancel} className={s.cancelBtn}>
        {i18n.t('Cancel')}
      </Button>
    </div>
  );
}

export function EditFeatureForm({
  geometry,
  fieldsSettings,
  changeProperty,
  featureProperties,
  onSave,
  onCancel,
}: EditFeatureFormProps) {
  // we only expecting point geometry ATM
  if (geometry !== null && geometry.type !== 'Point') return null;

  return (
    <div className={s.formContainer}>
      <div className={s.formParam}>
        <Label>{i18n.t('Location')}</Label>
        <Input
          disabled={true}
          className={s.formInput}
          value={
            geometry
              ? `${geometry.coordinates[0]}, ${geometry.coordinates[1]}`
              : ''
          }
        />
      </div>
      {Object.entries(fieldsSettings.featureProperties).map(([key, type]) => {
        function onPropertyChange(ev: ChangeEvent<HTMLInputElement>) {
          changeProperty(key, ev.target.value);
        }
        return (
          <div key={key} className={s.formParam}>
            <Label>{key}</Label>
            <Input
              onChange={onPropertyChange}
              className={s.formInput}
              value={featureProperties[key] ?? ''}
            />
          </div>
        );
      })}
      <ButtonPanel onSave={onSave} onCancel={onCancel} />
    </div>
  );
}

export function EditFeaturePlaceholder({
  onSave,
  onCancel,
}: {
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className={s.formContainer}>
      <Text type="short-m">
        {i18n.t('Select some feature for start edit feature properties')}
      </Text>
      <ButtonPanel onSave={onSave} onCancel={onCancel} />
    </div>
  );
}
