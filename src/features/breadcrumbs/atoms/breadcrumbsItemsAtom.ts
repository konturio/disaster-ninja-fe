import { action, atom } from '@reatom/core';

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

export const breadcrumbsItemsAtom = atom(ITEMS_PLACEHOLDER, 'breadcrumbsAtom');

export const onBreadcrumbClick = action((ctx, value: string) => {
  const items = ctx.get(breadcrumbsItemsAtom);
  const index = items.findIndex((item) => item.value === value);
  if (index !== -1 && index < items.length) {
    breadcrumbsItemsAtom(ctx, items.slice(0, index + 1));
  }
}, 'onItemClick');
