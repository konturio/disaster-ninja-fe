import { Geometry } from 'geojson';
import s from './AddOrEditFeatureForm.module.css';
import { LabelWithTooltip } from '~components/LabelWithTooltip/LabelWithTooltip';
import { translationService as i18n } from '~core/index';
import { Input } from '@k2-packages/ui-kit';
import { ChangeEvent } from 'react';

type AddOrEditFeatureFormProps = {
  geometry: Geometry | null;
  featureProperties: { [key: string]: string };
  changeProperty: (property: string, value: string) => void;
};

export function AddOrEditFeatureForm({
  geometry,
  featureProperties,
  changeProperty,
}: AddOrEditFeatureFormProps) {
  // we only expecting point geometry ATM
  if (geometry !== null && geometry.type !== 'Point') return null;

  return (
    <div className={s.formContainer}>
      <div className={s.formParam}>
        <LabelWithTooltip
          text={i18n.t('Location')}
          description={i18n.t('Location')}
        />
        <Input
          className={s.formInput}
          value={
            geometry
              ? `${geometry.coordinates[0]}, ${geometry.coordinates[1]}`
              : ''
          }
        />
      </div>
      {Object.entries(featureProperties).map(([key, value]) => {
        function onPropertyChange(ev: ChangeEvent<HTMLInputElement>) {
          changeProperty(key, ev.target.value);
        }
        <div className={s.formParam}>
          <LabelWithTooltip text={key} description={i18n.t(key)} />
          <Input
            onChange={onPropertyChange}
            className={s.formInput}
            value={value}
          />
        </div>;
      })}
    </div>
  );
}
