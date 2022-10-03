import s from './About.module.css';

export function AboutPage() {
  return <AboutText />;
}

function AboutText() {
  return (
    <div className={s.mainWrap}>
      <div className={s.content}>
        <h1 className={s.pageTitle}>Welcome to Disaster Ninja!</h1>
        <p>
          Do you want to be notified about ongoing disasters? Are you interested in
          instant population data and other analytics for any region in the world?
          Disaster Ninja showcases some of <a href="https://www.kontur.io/">Kontur</a>’s
          capabilities in addressing these needs.
        </p>
        <p>
          We initially designed it as a decision support tool for humanitarian mappers.
          Now it has grown in functionality and use cases. Whether you work in disaster
          management, build a smart city, or perform research on climate change, Disaster
          Ninja can help you to:
        </p>

        <blockquote>
          <h3>1. Stay up to date with the latest hazard events globally.</h3>
          <p>
            The Disasters panel continually refreshes to inform you about ongoing events.
            It consumes data from the{' '}
            <a href="https://www.kontur.io/portfolio/event-feed/">Kontur Event Feed</a>,
            which you can also access via an API.
          </p>
          <h3>2. Focus on your area of interest.</h3>
          <p>
            The Drawing Tools panel allows you to draw or upload your own geometry on the
            map. You can also focus on a disaster-exposed area or an administrative unit —
            a country, city, or region.
          </p>
          <h3>3. Get analytics for the focused area.</h3>
          <p>
            The Analytics panel shows the number of people living in that area per{' '}
            <a href="https://data.humdata.org/dataset/kontur-population-dataset">
              Kontur Population
            </a>{' '}
            and estimated mapping gaps in OpenStreetMap. Kontur’s customers have access to
            hundreds of other indicators through Advanced Analytics.
          </p>
          <h3>4. Explore data on the map and make conclusions.</h3>
          <p>
            The Layers panel gives you various options to display two indicators
            simultaneously on a bivariate map, e.g., population density and distance to
            the nearest fire station. Use the color legend to assess which areas require
            attention. <br />
            Hint: in general, green indicates low risk / few gaps, red — high risk / many
            gaps.
          </p>
        </blockquote>

        <p>
          In addition, you can switch to Reports in the left panel to access data on
          potential errors and inconsistencies in OpenStreetMap and help fix them by
          mapping the respective area with the JOSM editor.
        </p>

        <p className={s.linkToMain}>
          <a href="/"> Go to the map now ⭢ </a>
        </p>

        <p>
          We hope you find this tool valuable. Use the chatbox on Disaster Ninja for any
          questions about the functionality, and we will be happy to guide you. You can
          also <a href="hello@kontur.io">contact us by email</a> if you have feedback or
          suggestions on improving the tool.
        </p>

        <p>
          Disaster Ninja is an open-source project. Find the code in{' '}
          <a href="https://github.com/konturio">Kontur’s GitHub account</a>.
        </p>
      </div>
    </div>
  );
}
