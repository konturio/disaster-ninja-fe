// eslint-disable-next-line import/prefer-default-export
export function createGeoJSONSource(
  featureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection' as const,
    features: [],
  },
) {
  return {
    type: 'geojson' as const,
    data: featureCollection,
  };
}

export function readGeoJSON(file): Promise<GeoJSON.GeoJSON> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      if (event.target === null) return;
      const string = event.target.result?.toString();
      if (!string) return;
      try {
        const json = JSON.parse(string);
        if (json.type !== 'FeatureCollection' && json.type !== 'Feature') {
          throw new Error('Not geoJSON format');
        }
        res(json);
      } catch (error) {
        rej(error);
      }
    };
    reader.onerror = (error) => rej(error);
    reader.readAsText(file);
  });
}
