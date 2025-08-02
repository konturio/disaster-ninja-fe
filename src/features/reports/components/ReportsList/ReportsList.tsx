import { Text, Heading } from '@konturio/ui-kit';
import clsx from 'clsx';
import { Trans } from 'react-i18next';
import { useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import { useAtom } from '@reatom/react-v2';
import { i18n } from '~core/localization';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import { translateReportField } from '../../utils';
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
        <Heading type="heading-04">
          <span className={styles.pageTitle}>{i18n.t('reports.title')}</span>
        </Heading>
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
                <Heading type="heading-05">
                  <div className={clsx(styles.link, styles.reportTitle)}>
                    {translateReportField(report.name)}
                  </div>
                </Heading>
                <Text type="long-l">
                  <Markdown
                    options={{ overrides: { a: LinkRenderer } }}
                    className={clsx(styles.reportDescr)}
                  >
                    {translateReportField(report.description_brief)}
                  </Markdown>
                </Text>
              </div>
            );
          })}
      </div>
    </div>
  );
}
