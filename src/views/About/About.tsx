import { Trans } from 'react-i18next';
import { i18n } from '~core/localization';
import config from '~core/app_config';
import s from './About.module.css';

export function AboutPage() {
  return <AboutText />;
}

function AboutText() {
  return (
    <div className={s.mainWrap}>
      <div className={s.content}>
        <h1 className={s.pageTitle}>{i18n.t('about.title')}</h1>
        <p>
          <Trans i18nKey="about.intro">
            Do you want to be notified about ongoing disasters? Are you interested in
            instant population data and other analytics for any region in the world?
            Disaster Ninja showcases some of <a href="https://www.kontur.io/">Kontur</a>’s
            capabilities in addressing these needs.
            <br />
            <br />
            We initially designed it as a decision support tool for humanitarian mappers.
            Now it has grown in functionality and use cases. Whether you work in disaster
            management, build a smart city, or perform research on climate change,
            Disaster Ninja can help you to:
          </Trans>
        </p>

        <blockquote>
          <h3>{i18n.t('about.l1')}</h3>
          <p>
            <Trans i18nKey="about.p1">
              The Disasters panel continually refreshes to inform you about ongoing
              events. It consumes data from the{' '}
              <a href="https://www.kontur.io/portfolio/event-feed/">Kontur Event Feed</a>,
              which you can also access via an API.
            </Trans>
          </p>
          <h3>{i18n.t('about.l2')}</h3>
          <p>{i18n.t('about.p2')}</p>
          <h3>{i18n.t('about.l3')}</h3>
          <p>
            <Trans i18nKey="about.p3">
              The Analytics panel shows the number of people living in that area per{' '}
              <a href="https://data.humdata.org/dataset/kontur-population-dataset">
                Kontur Population
              </a>{' '}
              and estimated mapping gaps in OpenStreetMap. Kontur’s customers have access
              to hundreds of other indicators through Advanced Analytics.
            </Trans>
          </p>
          <h3>{i18n.t('about.l4')}</h3>
          <p>
            <Trans i18nKey="about.p4">
              The Layers panel gives you various options to display two indicators
              simultaneously on a bivariate map, e.g., population density and distance to
              the nearest fire station. Use the color legend to assess which areas require
              attention. <br />
              Hint: in general, green indicates low risk / few gaps, red — high risk /
              many gaps.
            </Trans>
          </p>
        </blockquote>

        <p>{i18n.t('about.p5')}</p>

        <p className={s.linkToMain}>
          <a href={config.baseUrl}>{i18n.t('about.goToMap')} ⭢ </a>
        </p>

        <p>
          <Trans i18nKey="about.p6">
            We hope you find this tool valuable. Use the chatbox on Disaster Ninja for any
            questions about the functionality, and we will be happy to guide you. You can
            also <a href="mailto:hello@kontur.io">contact us by email</a> if you have
            feedback or suggestions on improving the tool.
            <br />
            <br />
            Disaster Ninja is an open-source project. Find the code in{' '}
            <a href="https://github.com/konturio">Kontur’s GitHub account</a>.
          </Trans>
        </p>
      </div>
    </div>
  );
}
