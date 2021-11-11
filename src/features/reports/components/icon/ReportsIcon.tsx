import reportIcon from '../../icons/reportsIcon.svg';
import i18next from 'i18next';

export function ReportsIcon() {
  return <img src={reportIcon} alt={i18next.t('reports')} />;
}
