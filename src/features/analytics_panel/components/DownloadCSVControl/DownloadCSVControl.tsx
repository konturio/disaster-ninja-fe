import { Download16 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import { LayerActionIcon } from '~components/LayerActionIcon/LayerActionIcon';
import { i18n } from '~core/localization';
import { downloadCsv } from '~utils/file/download';
import { analyticsResourceAtom } from '../../atoms/analyticsResource';
import { analyticsToCsv } from '../../utils/toCsv';
import s from './DownloadCSVControl.module.css';
import type { AnalyticsData } from '~core/types';

export function DownloadCSVControl() {
  const [{ data }] = useAtom(analyticsResourceAtom);
  if (!data) return null;

  function handleClick() {
    const csv = analyticsToCsv(data as AnalyticsData[]);
    downloadCsv(csv, `analytics_${new Date().toISOString()}.csv`);
  }

  return (
    <LayerActionIcon
      onClick={handleClick}
      hint={i18n.t('analytics_panel.download_csv')}
      className={s.download}
    >
      <Download16 />
    </LayerActionIcon>
  );
}
