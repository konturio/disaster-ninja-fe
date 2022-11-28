import { Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { Trans } from 'react-i18next';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import { reportsAtom } from '../../atoms/reportsAtom';
import styles from './ReportsList.module.css';

export function ReportsList({ goToReport }: { goToReport: (id: string) => void }) {
  const [reports, { getReports }] = useAtom(reportsAtom);

  useEffect(() => {
    (async function () {
      if (!reports.length) getReports();
    })();
  }, [reports.length, getReports]);

  return (
    <div className={styles.mainWrap}>
      <div className={styles.titleRow}>
        <Text type="heading-l">
          <span className={styles.pageTitle}>{i18n.t('reports.title')}</span>
        </Text>
      </div>

      <Text type="long-l">
        <div className={clsx(styles.description, styles.reportsIntro)}>
          <Trans i18nKey="reports.description">
            <a
              href="https://www.kontur.io/"
              className={clsx(styles.paragraphLink, styles.link)}
            >
              Kontur{' '}
            </a>{' '}
            generates several reports that help validate OpenStreetMap quality. They
            contain links to areas on{' '}
            <a
              href="https://www.openstreetmap.org/"
              className={clsx(styles.paragraphLink, styles.link)}
            >
              osm.org{' '}
            </a>{' '}
            and links to open them in the JOSM editor with enabled remote control for
            editing.
          </Trans>
        </div>
      </Text>

      <div className={styles.reportCards}>
        {Boolean(reports.length) &&
          reports.map?.((report) => {
            const onClick = (e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              goToReport(report.id);
            };
            return (
              <div className={styles.reportWrap} key={report.id} onClick={onClick}>
                <Text type="heading-m">
                  <div className={clsx(styles.link, styles.reportTitle)}>
                    {report.name}
                  </div>
                </Text>
                <Text type="long-l">
                  <ReactMarkdown
                    className={clsx(styles.reportDescr)}
                    components={{ a: LinkRenderer }}
                  >
                    {report.description_brief}
                  </ReactMarkdown>
                </Text>
              </div>
            );
          })}
      </div>
    </div>
  );
}
