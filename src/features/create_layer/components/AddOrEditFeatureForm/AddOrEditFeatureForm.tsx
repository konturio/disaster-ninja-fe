import { Geometry } from 'geojson';
import s from './AddOrEditFeatureForm.module.css';
import { Label } from '~components/Label/Label';
import { translationService as i18n } from '~core/index';
import { Input } from '@k2-packages/ui-kit';
import { ChangeEvent } from 'react';
import { EditableLayerSettings } from '~features/create_layer/types';

type AddOrEditFeatureFormProps = {
  geometry: Geometry | null;
  fieldsSettings: EditableLayerSettings;
  featureProperties: { [key: string]: string };
  changeProperty: (property: string, value: string) => void;
};

export function AddOrEditFeatureForm({
  geometry,
  fieldsSettings,
  changeProperty,
  featureProperties,
}: AddOrEditFeatureFormProps) {
  // we only expecting point geometry ATM
  if (geometry !== null && geometry.type !== 'Point') return null;

  return (
    <div className={s.formContainer}>
      <div className={s.formParam}>
        <Label>{i18n.t('Location')}</Label>
        <Input
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
    </div>
  );
}
