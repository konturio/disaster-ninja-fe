import { Panel } from '@konturio/ui-kit';
import { useAction, useAtom } from '@reatom/npm-react';
import { action, atom } from '@reatom/core';
import Breadcrumbs from '../Breadcrumbs';

const ITEMS_PLACEHOLDER = [
  { label: 'Country 1', value: 'Country 1' },
  { label: 'Administrative unit 2', value: 'Administrative unit 2' },
  { label: 'Administrative unit 3', value: 'Administrative unit 3' },
  { label: 'Administrative unit 4', value: 'Administrative unit 4' },
  { label: 'City 5', value: 'City 5' },
  { label: 'District 6', value: 'District 6' },
  { label: 'District 7', value: 'District 7' },
  { label: 'Administrative unit 8', value: 'Administrative unit 8' },
  { label: 'Administrative unit 9', value: 'Administrative unit 9' },
  { label: 'Administrative unit 10', value: 'Administrative unit 10' },
  { label: 'Administrative unit 11', value: 'Administrative unit 11' },
];

const breadcrumbsItemsAtom = atom(ITEMS_PLACEHOLDER, 'breadcrumbsAtom');

const onBreadcrumbClick = action((ctx, value: string) => {
  const items = ctx.get(breadcrumbsItemsAtom);
  const index = items.findIndex((item) => item.value === value);
  if (index !== -1 && index < items.length) {
    breadcrumbsItemsAtom(ctx, items.slice(0, index + 1));
  }
}, 'onItemClick');

const BreadcrumbsPanel = () => {
  const [items] = useAtom(breadcrumbsItemsAtom);

  const handleClick = useAction(onBreadcrumbClick);

  return (
    <Panel resize="none">
      <Breadcrumbs items={items} onClick={handleClick} />
    </Panel>
  );
};

export default BreadcrumbsPanel;
