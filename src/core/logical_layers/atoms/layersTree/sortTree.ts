import { TreeChildren } from './types';

const _internalTypes = {
  withoutType: 'without_type',
};

function clusterSort(
  list: TreeChildren[],
  {
    order,
    inClusterSortField,
  }: {
    order: string[];
    inClusterSortField: string;
  },
) {
  order = [_internalTypes.withoutType, ...order];
  const clusters = {};
  list.forEach((l) => {
    // Find entity type
    let type: string = _internalTypes.withoutType;
    for (const k in l) {
      if (l[k] === true && order.includes(k)) {
        type = k;
        break;
      }
    }

    // Save entity in clusters using type as key
    clusters[type] ? clusters[type].push(l) : (clusters[type] = [l]);
  });

  // Sort entities inside type and join to sorted list
  let result: TreeChildren[] = [];
  order.forEach((o) => {
    if (clusters[o]) {
      result = result.concat(
        clusters[o].sort(
          (a, b) => a[inClusterSortField] - b[inClusterSortField],
        ),
      );
    }
  });
  return result;
}

interface SorterSettings {
  order: string[];
  inClusterSortField: string;
}

export function sortChildren(list: TreeChildren[], settings: SorterSettings) {
  list.map((c) => {
    if ('children' in c) {
      c.children = sortChildren(c.children, settings);
    }
  });
  return clusterSort(list, settings);
}
