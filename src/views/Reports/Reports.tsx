import { AppHeader } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { ReportsList } from '~features/reports/components/ReportsList/ReportsList';
import s from './Reports.module.css';

export function Reports() {
  return (
    <div>
      <div className={s.headerContainer}>
        <AppHeader title={`Disaster Ninja ${i18n.t('Reports')}`} />
      </div>
      <ReportsList />
    </div>
  );
}
