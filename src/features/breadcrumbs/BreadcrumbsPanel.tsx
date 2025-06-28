import { Panel } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useAction } from '@reatom/npm-react';
import { constructOptionsFromBoundaries } from '~utils/map/boundaries';
import { i18n } from '~core/localization';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import s from './BreadcrumbsPanel.module.css';
import { onBreadcrumbClick, onZoomToWholeWorld } from './atoms/breadcrumbsItemsAtom';
import { useBreadcrumbsItems } from './hooks/useBreadcrumbsItems';

const noBreadcrumbsOption = {
  label: i18n.t('zoom_to_world'),
  value: 'zoom to world',
};

export function BreadcrumbsPanel({ hasToolbar = true }: { hasToolbar?: boolean }) {
  const items = useBreadcrumbsItems();
  const breadcrumbItemClick = useAction(onBreadcrumbClick);
  const zoomToTheWorld = useAction(onZoomToWholeWorld);

  const options = items?.length
    ? constructOptionsFromBoundaries(items).reverse()
    : [noBreadcrumbsOption];
  const clickHandler = items?.length ? breadcrumbItemClick : zoomToTheWorld;

  return (
    <Panel
      resize="none"
      className={clsx(s.breadcrumbsPanel, !hasToolbar && s.noToolbar)}
      contentClassName={s.content}
    >
      <Breadcrumbs items={options} onClick={clickHandler} />
    </Panel>
  );
}
