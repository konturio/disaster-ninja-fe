import { Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { reportsAtom } from '~features/reports/atoms/reportsAtom';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { LinkRenderer } from '~utils/markdown/mdComponents';
import { ReportTable } from '../ReportTable/ReportTable';
import { tableAtom } from '../../atoms/tableAtom';
import commonStyles from '../ReportsList/ReportsList.module.css';
import styles from './Report.module.css';

type Params = {
  reportId: string;
};

export function ReportInfo() {
  const { reportId } = useParams<Params>();

  const [reports, { getReports }] = useAtom(reportsAtom);
  const [report, { setReport }] = useAtom(tableAtom);

  useEffect(() => {
    if (!reports.length) getReports();
  }, []);

  useEffect(() => {
    if (reports.length) {
      const meta = reports.find((report) => report.id === reportId);
      if (!meta)
        notificationServiceInstance.error({ title: i18n.t('Wrong report ID') });
      else setReport(meta);
    }
  }, [reports]);

  return (
    <div className={styles.mainWrap}>
      <Text type="short-l">
        <Link
          to={'../reports'}
          className={clsx(commonStyles.link, styles.seeAllLink)}
        >
          {i18n.t('See all reports')}
        </Link>
      </Text>

      <Text type="heading-m">
        <span className={clsx(commonStyles.pageTitle, styles.title)}>
          {report.meta?.name}
        </span>
      </Text>

      {report.meta?.description_full && (
        <Text type="long-l">
          <ReactMarkdown
            className={commonStyles.description}
            components={{ a: LinkRenderer }}
          >
            {report.meta.description_full}
          </ReactMarkdown>
        </Text>
      )}

      {Boolean(report.meta?.last_updated) && (
        <Text type="caption">
          <div className={styles.lastUpdated}>
            {i18n.t('Updated ') + report.meta?.last_updated}
          </div>
        </Text>
      )}

      {!report.data?.length && (
        <div className={styles.loadingContainer}>
          <LoadingSpinner message={i18n.t('Rendering data')} />
        </div>
      )}
      <div className={clsx(!report.data?.length && styles.invisible)}>
        <ReportTable />
      </div>
    </div>
  );
}
