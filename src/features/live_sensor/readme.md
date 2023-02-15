### Live sensor feature

This is a feature in development. It designed to collect user sensor data and send it to remote endpoint

#### Working logic

Feature is added to user interface throughout sidebar component.
For the first activation user will have to accept permissions for sensors.
After that each sensor except geolocation will populate `sensorDataAtom` whenever possible.
Meanwhile `collectedPointsAtom` will add geojson point created from sensor data and geolocation on each geolocation update. After adding point, `triggerRequestAction` will be called to PUT request by `resourceTriggerAtom`, and populate it's payload from `collectedPointsAtom`. If no error occurs - `collectedPointsAtom` and `sensorDataAtom` will be reset

When user decides to stop collecting data, several cleanups and resets must be called to out feature back into initial state. `SensorResourceAtom` must not send data after that. Feature will become inactive.

[See diagram in figma](https://www.figma.com/file/GRMz4BnDfr5qFXafmrMt9Y/Live-sensor-feature?node-id=0%3A1&t=w2FGK3oikxVbA5QU-1)

`sensorDataAtom` collects buffer of data and cleans itself up from data older than `SENSOR_DATA_LIFETIME`
`collectedPointsAtom` collects points until they're successfully sent away.

#### Output

For the request we'll sent roughly following JSON:

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
        accelX: [1, .9, .8, .9],
        accelY: [1, .9, .8, .9],
        accelZ: [1, .9, .8, .9],
        accelTime: [12424119, 12424120, 12424121, 12424122],
,
        orientX: [1, .9, .8, .9],
        orientY: [1, .9, .8, .9],
        orientZ: [1, .9, .8, .9],
        orientW: [1, .9, .8, .9],
        orientTime: [12424116, 12424119, 12424121, 12424122],
,
        gyroX: [1, 1, 1, 1],
        gyroY: [1, 1, .9, 1],
        gyroZ: [1, .9, .9, 1],
        gyroTime: [12424117, 12424118, 12424121, 12424122],

        lng: [22.11],
        lat: [5.22],
        alt: [22],
        speed: [6],
        accuracy: [.3],
        altAccuracy: [1],
        heading: [0],
        coordTimestamp: [12424122],
        coordSystTimestamp: [12424124],

        timestamp: [12424124],
      }
    },

    // ...etc
  ]
}
```
