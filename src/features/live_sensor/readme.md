### Live sensor feature

This is a feature in development. It designed to collect user sensor data and send it to remote endpoint

#### Working logic

Feature is added to user interface throughout sidebar component.
For the first activation user will have to accept permissions for sensors.
After that each sensor will populate `sensorDataAtom` whenever possible.
Meanwhile `collectedPointsAtom` will collect geojson points created from sensor data in a given interval of `RECORD_UPDATES_INTERVAL`.
`SensorResourceAtom` will be triggered to PUT request by `resourceTriggerAtom`, and populate it's payload from `collectedPointsAtom`. `resourceTriggerAtom` will be poked on another interval `REQUESTS_INTERVAL`

When user decides to stop collecting data, several cleanups and resets must be called to out feature back into initial state. `SensorResourceAtom` must not send data after that. Feature will become inactive.

[See diagram in figma](https://www.figma.com/file/GRMz4BnDfr5qFXafmrMt9Y/Live-sensor-feature?node-id=0%3A1&t=w2FGK3oikxVbA5QU-1)

#### In-time structure

1. User starts recording
2. `collectedPointsAtom` set to add new point each `RECORD_UPDATES_INTERVAL`. Point being created with latest `sensorDataAtom` values based on latest coordinates data. No coordinates = no point added
3. Sensors set to store data in `sensorDataAtom`. Sensors started.
4. Geolocation set to store data in `sensorDataAtom` and trigger a request on each update. Geolocation started.
5. When request triggered - all collected points sent away. `collectedPointsAtom` resets to empty array and collect points based on new coordinates

#### Output

For the request we'll sent following JSON:

```js
{
  type: 'FeatureCollection',
  features: [
    // point created on first 100ms (if RECORD_UPDATES_INTERVAL === 100)
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat],
      },
      properties: {
        accelerometer: { ...accelerometerSensorData },
        orientation: { ...orientationSensorData },
        gyroscope: { ...gyroscopeSensorData },
        geolocation: { ...coordinatesData },
      }
    },

    // point created on second 100ms
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat],
      },
      properties: {
        accelerometer: { ...accelerometerSensorData },
        orientation: { ...orientationSensorData },
        gyroscope: { ...gyroscopeSensorData },
        geolocation: { ...coordinatesData },
      }
    },

    // ...etc
  ]
}
```
