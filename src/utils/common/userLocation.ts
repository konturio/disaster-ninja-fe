export function getUserLocation() {
  return new Promise<[number, number]>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve([longitude, latitude]);
      },
      (error) => {
        reject(new Error(`Error getting location: ${error.message}`));
      },
    );
  });
}
