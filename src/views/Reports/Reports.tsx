import { AppHeader } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { ReportsList } from '~features/reports/components/ReportsList/ReportsList';
import { Row } from '~components/Layout/Layout';
import { BetaLabel } from '~components/BetaLabel/BetaLabel';
import s from './Reports.module.css';

export function Reports() {
  return (
    <div>
      <div className={s.headerContainer}>
        <AppHeader title={`Disaster Ninja ${i18n.t('Reports')}`}>
          <Row>
            <BetaLabel />
          </Row>
        </AppHeader>
      </div>
      <ReportsList />
    </div>
  );
}
