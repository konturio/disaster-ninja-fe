import { Atom } from '@reatom/core';
import { CreateLayerModel } from '~features/create_layer/types';
import s from './CreateLayerForm.module.css';
import { useAtom } from '@reatom/react';
import { LabelWithTooltip } from '~components/LabelWithTooltip/LabelWithTooltip';
import { translationService as i18n } from '~core/index';
import { Button, Input } from '@k2-packages/ui-kit';
import { MarkerIcon, UploadFileIcon } from '@k2-packages/default-icons';
import clsx from 'clsx';

interface CreateLayerFormProps {
  data: Atom<CreateLayerModel>;
}

export function CreateLayerForm({ data }: CreateLayerFormProps) {
  const [ formState ] = useAtom(data);

  return (
    <div className={s.formContainer}>
      <div className={s.formParam}>
        <LabelWithTooltip text={i18n.t('Layer name')} description={i18n.t('Layer name')} />
        <Input className={s.formInput} />
      </div>
      <div className={s.formParam}>
        <LabelWithTooltip text={i18n.t('Marker icon')} description={i18n.t('Marker icon')} />
        <Button>
          <MarkerIcon />
        </Button>
      </div>
      <div className={s.fieldsContainer}>
        <div className={clsx(s.fieldsLabel, 'k-font-caption')}>
          <div className={s.textCaption}>{i18n.t('Fields')}</div>
        </div>
        <Button className={s.addFieldButton} variant='invert-outline'>
          <UploadFileIcon />
          {i18n.t('Add field')}
        </Button>
      </div>
      <div className={s.buttonsContainer}>
        <Button className={s.saveBtn}>
          {i18n.t('Save')}
        </Button>
        <Button className={s.cancelBtn}>
          {i18n.t('Cancel')}
        </Button>
      </div>
    </div>
  )
}
