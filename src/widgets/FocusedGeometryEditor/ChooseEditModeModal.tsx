import { Button, ModalDialog, Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import s from './ChooseEditModeModal.module.css';

export type GeometryEditChoice = 'draw' | 'edit';

type Props = {
  onConfirm: (value: GeometryEditChoice | null) => void;
};

export default function ChooseEditModeModal({ onConfirm }: Props) {
  return (
    <ModalDialog
      title={i18n.t('focused_geometry_editor_modal.title')}
      onClose={() => onConfirm(null)}
      footer={
        <div className={s.buttonsRow}>
          <Button variant="invert-outline" onClick={() => onConfirm('edit')}>
            {i18n.t('focused_geometry_editor_modal.edit_existing')}
          </Button>
          <Button onClick={() => onConfirm('draw')}>
            {i18n.t('focused_geometry_editor_modal.draw_new')}
          </Button>
        </div>
      }
    >
      <Text type="short-m">
        {i18n.t('focused_geometry_editor_modal.question')}
      </Text>
    </ModalDialog>
  );
}
