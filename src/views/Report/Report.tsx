import { AppHeader } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { ReportInfo } from '~features/reports/components/ReportInfo/ReportInfo';

export function ReportPage() {
  return (
    <div>
      <AppHeader title={`Disaster Ninja ${i18n.t('Reports')}`} />

      <ReportInfo />
    </div>
  );
}
