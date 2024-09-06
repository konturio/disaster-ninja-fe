export const mapLocations = (items: GeoJSON.Feature[]) => {
  const validItems: { title: string; value: number }[] = [];

  for (const item of items) {
    if (item.properties?.display_name && item.properties?.osm_id) {
      validItems.push({
        title: item.properties.display_name,
        value: item.properties.osm_id,
      });
    }
  }

  return validItems;
};
