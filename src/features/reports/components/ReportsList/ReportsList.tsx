import { Text } from '@k2-packages/ui-kit';
import { Link } from 'react-router-dom';
import { TranslationService as i18n } from '~core/localization';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Trans } from 'react-i18next';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { reportsAtom } from '~features/reports/atoms/reportsAtom';
import { useAtom } from '@reatom/react';
import config from '~core/app_config';
import styles from './ReportsList.module.css';
import arrowIcon from '../../icons/arrow.svg';

export function ReportsList() {
  const history = useHistory();
  const [reports, { getReports }] = useAtom(reportsAtom);

  useEffect(() => {
    (async function () {
      if (!reports.length) getReports();
    })();
  }, []);

  return (
    <div className={styles.mainWrap}>
      <div className={styles.titleRow}>
        <Text type="heading-l">
          <span className={styles.pageTitle}>
            {i18n.t('Disaster Ninja Reports')}
          </span>
        </Text>
        <Text type="heading-l">
          <Link
            to={config.baseUrl}
            className={clsx(styles.linkToMain, styles.link)}
          >
            disaster.ninja
            <img src={arrowIcon} />
          </Link>
        </Text>
      </div>

      <Text type="long-l">
        <div className={clsx(styles.description, styles.reportsIntro)}>
          <Trans i18nKey="description">
            <a
              href="https://www.kontur.io/"
              className={clsx(styles.paragraphLink, styles.link)}
            >
              Kontur{' '}
            </a>{' '}
            generates several reports that help validate OpenStreetMap quality.
            They have links to OpenStreetMap objects on osm.org as well as links
            to OpenStreetMap remote control so that you can use them within the
            JOSM editor.
          </Trans>
        </div>
      </Text>

      <div className={styles.reportCards}>
        {Boolean(reports.length) &&
          reports.map?.((report) => {
            const goToReport = (e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              history.push(config.baseUrl + 'reports/' + report.id);
            };
            return (
              <div
                className={styles.reportWrap}
                key={report.id}
                onClick={goToReport}
              >
                <Text type="heading-m">
                  <div className={clsx(styles.link, styles.reportTitle)}>
                    {report.name}
                  </div>
                </Text>
                <Text type="long-l">
                  <ReactMarkdown className={clsx(styles.reportDescr)}>
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
