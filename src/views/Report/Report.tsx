import { AppHeader } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { Text } from '@k2-packages/ui-kit';
import { ReportInfo } from '~features/reports/components/ReportInfo/ReportInfo';
import s from './Report.module.css';

export function ReportPage() {
  return (
    <div>
      <div className={s.headerContainer}>
        <AppHeader title={`Disaster Ninja ${i18n.t('Reports')}`} />
        <Text type="heading-l">{i18n.t('Disaster Ninja')}</Text>
      </div>
      <ReportInfo />
    </div>
  );
}
