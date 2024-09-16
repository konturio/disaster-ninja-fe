import { Panel } from '@konturio/ui-kit';
import { useAction, useAtom } from '@reatom/npm-react';
import { action, atom } from '@reatom/core';
import Breadcrumbs from './components/Breadcrumbs';
import s from './BreadcrumbsPanel.module.css';

const ITEMS_PLACEHOLDER = [
  { label: 'Poland', value: 'Country 1' },
  { label: 'Masovian Voivodeship', value: 'Administrative unit 2' },
  { label: 'Warsaw', value: 'Administrative unit 3' },
  { label: 'Ursynów', value: 'Administrative unit 4' },
  { label: 'Ursynów Połnocny', value: 'City 5' },
  { label: 'Stokłosy', value: 'District 6' },
  { label: 'Wysoki Ursynów', value: 'District 7' },
  { label: 'Wysoki Ursynów 1', value: 'District 8' },
  { label: 'Wysoki Ursynów 2', value: 'District 9' },
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
    <Panel resize="none" className={s.breadcrumbsPanel}>
      <Breadcrumbs items={items} onClick={handleClick} />
    </Panel>
  );
};

export default BreadcrumbsPanel;
