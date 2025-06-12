import { Input, Text } from '@konturio/ui-kit';
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
};

export function EditFeatureForm({
  geometry,
  fieldsSettings,
  changeProperty,
  featureProperties,
}: EditFeatureFormProps) {
  return (
    <div className={s.formContainer}>
      {geometry?.type === 'Point' && (
        <Input
          disabled={true}
          className={s.formParam}
          renderLabel={<Label>{i18n.t('create_layer.location')}</Label>}
          value={geometry ? `${geometry.coordinates[0]}, ${geometry.coordinates[1]}` : ''}
        />
      )}
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
    </div>
  );
}

export function EditFeaturePlaceholder() {
  return (
    <div className={s.formContainer}>
      <Text type="short-m">{i18n.t('create_layer.edit_feature_placeholder')}</Text>
    </div>
  );
}
