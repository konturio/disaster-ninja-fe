# Live sensor feature

This feature designed to collect user sensor data and send it to remote endpoint

## UI

The toolbar contains **Record sensors** button. Once recording starts the button label changes to **Stop sensor recording**, so pressing it will stop recording.

## Working logic

The main controller is `LiveSensor`.
It describe what sensors we want to listen, pass sensors to [SensorsRecorder](#sensorsrecorder) that collect data from sensors, and pass collected data from recorder to [SensorsSnapshotsSender](#sensorssnapshotssender) that prepare and sends this records to API

### AppSensorsController

Confiture, setup, start/stop sensors and provide unified api for them, select what sensor is main (leading)

### SensorsRecorder

The SensorsSnapshotsSender takes records one by one from the recorder, starting from the beginning, converts them into API DTO, and tries to send them. If successful, the sent record is removed from the records queue, and the process is repeated.

[See diagram in figma](https://www.figma.com/file/qPjefXJPvxDkbdrdtVYoKr/live-sensor?node-id=0-1&t=rajS3sg76JtIhqXg-0)

#### Output

Example of sended data

```js
{
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'asdvSADczfvadsf',
      geometry: {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat],
      },
      properties: {
        // Note that updates collected in arrays, in some kind of table with rows and columns
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
