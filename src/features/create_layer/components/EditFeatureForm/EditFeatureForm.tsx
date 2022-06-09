import { Button, Input, Text } from '@konturio/ui-kit';
import { Label } from '~components/Label/Label';
import { i18n } from '~core/localization';
import s from './EditFeatureForm.module.css';
import type { ChangeEvent } from 'react';
import type { Geometry } from 'geojson';
import type { EditableLayerSettings } from '../../types';

type EditFeatureFormProps = {
  geometry: Geometry | null;
  fieldsSettings: EditableLayerSettings;
  featureProperties: { [key: string]: string };
  changeProperty: (property: string, value: string) => void;
  onSave: () => void;
};

function ButtonPanel({ onSave }: { onSave: () => void }) {
  return (
    <div className={s.buttonsContainer}>
      <Button onClick={onSave} className={s.saveBtn}>
        {i18n.t('Save Features')}
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
}: EditFeatureFormProps) {
  // we only expecting point geometry ATM
  if (geometry !== null && geometry.type !== 'Point') return null;

  return (
    <div className={s.formContainer}>
      <Input
        disabled={true}
        className={s.formParam}
        renderLabel={<Label>{i18n.t('Location')}</Label>}
        value={
          geometry
            ? `${geometry.coordinates[0]}, ${geometry.coordinates[1]}`
            : ''
        }
      />
      {Object.entries(fieldsSettings.featureProperties).map(([key, type]) => {
        function onPropertyChange(ev: ChangeEvent<HTMLInputElement>) {
          changeProperty(key, ev.target.value);
        }
        return (
          <Input
            key={key}
            onChange={onPropertyChange}
            value={featureProperties[key] ?? ''}
            renderLabel={<Label>{key}</Label>}
            className={s.formParam}
          />
        );
      })}
      <ButtonPanel onSave={onSave} />
    </div>
  );
}

export function EditFeaturePlaceholder() {
  return (
    <div className={s.formContainer}>
      <Text type="short-m">
        {i18n.t('Select some feature for start edit feature properties')}
      </Text>
    </div>
  );
}
