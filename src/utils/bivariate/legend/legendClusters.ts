export function clusterize(arr: any[], key = 'id') {
  const clusterMap = arr.reduce((acc, item) => {
    const clusterName = item[key].slice(0, 1);
    if (acc[clusterName]) {
      acc[clusterName].push(item);
    } else {
      acc[clusterName] = [item];
    }
    return acc;
  }, {});
  return Object.values(clusterMap);
}

export function invertClusters(arr, key = 'id') {
  const clusters = [...clusterize(arr, key)].reverse();
  return clusters.reduce((acc: any[], cluster) => acc.concat(cluster), []);
}
