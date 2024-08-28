import { LinkRenderer, ShortLinkRenderer } from './LinkRenderer';

export default (
  <blockquote>
    <br />
    LinkRenderer: <LinkRenderer href="https://kontur.io">kontur.io</LinkRenderer>
    <br />
    <br />
    ShortLinkRenderer short:
    <ShortLinkRenderer href="https://kontur.io">{['kontur.io']}</ShortLinkRenderer>
    <br />
    ShortLinkRenderer gdacs:
    <ShortLinkRenderer href="https://www.gdacs.org/report.aspx?eventid=1102779&episodeid=6&eventtype=FL">
      {['gdacs.org/report.aspx?eventtype=EQ&eventid=1441158']}
    </ShortLinkRenderer>
    <br />
    ShortLinkRenderer long:
    <ShortLinkRenderer href="https://disaster.ninja/active/?layers=kontur_lines%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cpopulation_density%2Cfocused-geometry">
      {[
        'https://disaster.ninja/active/?layers=kontur_lines%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cpopulation_density%2Cfocused-geometry',
      ]}
    </ShortLinkRenderer>
  </blockquote>
);
