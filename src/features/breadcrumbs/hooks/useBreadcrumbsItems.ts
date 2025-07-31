import { useAction, useAtom } from '@reatom/npm-react';
import { useEffect } from 'react';
import { currentMapPositionAtom } from '~core/shared_state/currentMapPosition';
import {
  breadcrumbsItemsAtom,
  fetchBreadcrumbsItems,
} from '../atoms/breadcrumbsItemsAtom';

export function useBreadcrumbsItems() {
  const [items] = useAtom(breadcrumbsItemsAtom);
  const [loading] = useAtom(fetchBreadcrumbsItems.pendingAtom);
  const [currentMapPosition] = useAtom(currentMapPositionAtom);
  const fetchBreadcrumbs = useAction(fetchBreadcrumbsItems);

  useEffect(() => {
    fetchBreadcrumbs(currentMapPosition);
  }, [currentMapPosition, fetchBreadcrumbs]);

  return { items, loading: loading > 0 };
}
