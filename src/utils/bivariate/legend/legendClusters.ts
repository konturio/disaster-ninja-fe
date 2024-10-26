export function clusterize<T>(arr: T[], key = 'id'): T[][] {
  const clusterMap = arr.reduce(
    (acc, item) => {
      const clusterName = item[key].slice(0, 1);
      if (acc[clusterName]) {
        acc[clusterName].push(item);
      } else {
        acc[clusterName] = [item];
      }
      return acc;
    },
    {} as Record<string, T[]>,
  );
  return Object.values(clusterMap);
}

export function invertClusters<T>(arr, key = 'id'): T[] {
  const clusters = [...clusterize<T>(arr, key)].reverse();
  return clusters.reduce((acc: T[], cluster) => acc.concat(cluster), [] as T[]);
}
