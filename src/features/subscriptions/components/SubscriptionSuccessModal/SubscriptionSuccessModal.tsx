import { Button, ModalDialog, Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import s from './SubscriptionSuccessModal.module.css';

type Props = {
  onConfirm: (value: unknown) => void;
};

export default function SubscriptionSuccessModal({ onConfirm }: Props) {
  return (
    <ModalDialog
      title={i18n.t('subscription.success_modal.title')}
      onClose={() => {
        onConfirm(null);
      }}
      footer={
        <div className={s.buttonsRow}>
          <Button type="submit" onClick={onConfirm}>
            {i18n.t('ok')}
          </Button>
        </div>
      }
    >
      <p>
        <Text type="short-m">
          {i18n.t('subscription.success_modal.thank_you_for_subscribing')}
        </Text>
      </p>
      <p>
        <Text type="short-m">
          {i18n.t('subscription.success_modal.after_the_page_refreshes')}
        </Text>
      </p>
    </ModalDialog>
  );
}
