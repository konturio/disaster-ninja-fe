import { Panel } from '@konturio/ui-kit';
import { useAction, useAtom } from '@reatom/npm-react';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import s from './BreadcrumbsPanel.module.css';
import { breadcrumbsItemsAtom, onBreadcrumbClick } from './atoms/breadcrumbsItemsAtom';

const BreadcrumbsPanel = () => {
  const [items] = useAtom(breadcrumbsItemsAtom);

  const handleClick = useAction(onBreadcrumbClick);

  return items.length > 0 ? (
    <Panel resize="none" className={s.breadcrumbsPanel}>
      <Breadcrumbs items={items} onClick={handleClick} />
    </Panel>
  ) : (
    <></>
  );
};

export default BreadcrumbsPanel;
