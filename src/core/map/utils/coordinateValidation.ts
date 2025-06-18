/**
 * Validates if longitude and latitude coordinates are within valid ranges.
 * Reusable utility based on validation patterns from URL encoder.
 *
 * @param lng - Longitude value to validate
 * @param lat - Latitude value to validate
 * @returns true if coordinates are valid, false otherwise
 */
export function isValidLngLat(lng: number, lat: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Validates if a coordinate pair [lng, lat] is within valid ranges.
 *
 * @param lngLat - Coordinate pair [longitude, latitude]
 * @returns true if coordinates are valid, false otherwise
 */
export function isValidLngLatArray(lngLat: [number, number]): boolean {
  const [lng, lat] = lngLat;
  return isValidLngLat(lng, lat);
}
