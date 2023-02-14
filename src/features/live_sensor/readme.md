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
        accelX: {1, .9, .8, .9},
        accelY: {1, .9, .8, .9},
        accelZ: {1, .9, .8, .9},
,
        orientX: {1, .9, .8, .9},
        orientY: {1, .9, .8, .9},
        orientZ: {1, .9, .8, .9},
        orientW: {1, .9, .8, .9},
,
        gyroX: {1, .9, null, null},
        gyroY: {1, .9, null, null},
        gyroZ: {1, .9, null, null},
        lng: {22.11, 22.1155, 22.11556, 22.11531},
        lat: {5.22, 5.23, 5.224, 5.2264},
        alt: {22, 22, 22, 22},
        speed: {6, 8, 9, 8},
        accuracy: {.3, .5, .5, .5},
        heading: {0, 0, 0, 0},
        coordTimestamp: {12424122, 12424123, 12424126, 12424127},
        coordSystTimestamp: {12424124, 12424125, 12424126, 12424127},

        timestamp: {12424124, 12424125, 12424126, 12424127},
      }
    },

    // ...etc
  ]
}
```
