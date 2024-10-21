import { Panel } from '@konturio/ui-kit';
import { useAction, useAtom } from '@reatom/npm-react';
import { constructOptionsFromBoundaries } from '~utils/map/boundaries';
import { FeatureCollection } from '~utils/geoJSON/helpers';
import { i18n } from '~core/localization';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import s from './BreadcrumbsPanel.module.css';
import {
  breadcrumbsItemsAtom,
  onBreadcrumbClick,
  onZoomToWholeWorld,
} from './atoms/breadcrumbsItemsAtom';

const noBreadcrumbsOption = {
  label: i18n.t('zoom_to_world'),
  value: 'no breadcrumb items',
};

const BreadcrumbsPanel = () => {
  const [items] = useAtom(breadcrumbsItemsAtom);

  const breadcrumbItemClick = useAction(onBreadcrumbClick);
  const zoomToTheWorld = useAction(onZoomToWholeWorld);

  const options = items?.length
    ? constructOptionsFromBoundaries(items).reverse()
    : [noBreadcrumbsOption];
  const clickHandler = items?.length ? breadcrumbItemClick : zoomToTheWorld;

  /** Don't render the Breadcrumbs panel or empty label until items have been fetched from the server. */
  return items ? (
    <Panel resize="none" className={s.breadcrumbsPanel}>
      <Breadcrumbs items={options} onClick={clickHandler} />
    </Panel>
  ) : null;
};

export default BreadcrumbsPanel;
