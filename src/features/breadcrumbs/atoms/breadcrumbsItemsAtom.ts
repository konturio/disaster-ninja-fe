import { action, atom } from '@reatom/core';
import type { BoundaryOption } from '~utils/map/boundaries';

export const breadcrumbsItemsAtom = atom<BoundaryOption[]>([], 'breadcrumbsAtom');

export const onBreadcrumbClick = action((ctx, value: string | number) => {
  const items = ctx.get(breadcrumbsItemsAtom);
  const index = items.findIndex((item) => item.value === value);
  if (index !== -1) {
    breadcrumbsItemsAtom(ctx, items.slice(0, index + 1));
  }
}, 'onItemClick');
