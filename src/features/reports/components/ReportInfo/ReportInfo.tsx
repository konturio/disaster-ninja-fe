import { Text, Heading } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAtom } from '@reatom/react-v2';
import { i18n } from '~core/localization';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import { reportsAtom } from '../../atoms/reportsAtom';
import { currentReportAtom, reportResourceAtom } from '../../atoms/reportResource';
import commonStyles from '../ReportsList/ReportsList.module.css';
import { ReportTable } from '../ReportTable/ReportTable';
import { Searchbar } from '../search/Searchbar';
import styles from './Report.module.css';

type Params = {
  reportId: string;
};

export function ReportInfo() {
  const { reportId } = useParams<Params>();

  const [reports, { getReports }] = useAtom(reportsAtom);
  const [report, { setReport }] = useAtom(currentReportAtom);
  const [reportResource] = useAtom(reportResourceAtom);

  useEffect(() => {
    if (!reports.length) getReports();
  }, []);

  useEffect(() => {
    if (reports.length) {
      const report = reports.find((report) => report.id === reportId);
      if (!report)
        notificationServiceInstance.error({
          title: i18n.t('reports.wrong_id'),
        });
      else setReport(report);
    }
  }, [reports]);

  return (
    <div className={styles.mainWrap}>
      <Text type="short-l">
        <Link to={'../reports'} className={clsx(commonStyles.link, styles.seeAllLink)}>
          {i18n.t('reports.see_all')}
        </Link>
      </Text>

      <Heading type="heading-05">
        <span className={clsx(commonStyles.pageTitle, styles.title)}>{report?.name}</span>
      </Heading>

      {report?.description_full && (
        <Text type="long-l">
          <ReactMarkdown
            className={commonStyles.description}
            components={{ a: LinkRenderer }}
          >
            {report.description_full}
          </ReactMarkdown>
        </Text>
      )}

      {Boolean(report?.last_updated) && (
        <Text type="caption">
          <div className={styles.lastUpdated}>
            {i18n.t('updated') + ` ${report?.last_updated}`}
          </div>
        </Text>
      )}

      {reportResource.loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner message={i18n.t('reports.loading')} />
        </div>
      ) : (
        <div className={clsx(!reportResource.data && styles.invisible)}>
          {report?.searchable_columns_indexes?.length && (
            <Searchbar searchIndexes={report.searchable_columns_indexes} />
          )}
          <ReportTable />
        </div>
      )}
    </div>
  );
}
