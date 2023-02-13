### Live sensor feature

This is a feature in development. It designed to collect user sensor data and send it to remote endpoint

#### Working logic

Feature is added to user interface throughout sidebar component.
For the first activation user will have to accept permissions for sensors.
After that each sensor will populate `sensorDataAtom` whenever possible.
Meanwhile `collectedPointsAtom` will collect geojson points created from sensor data in a given interval of `RECORD_UPDATES_INTERVAL`.
`SensorResourceAtom` will be triggered to PUT request by `resourceTriggerAtom`, and populate it's payload from `collectedPointsAtom`. `resourceTriggerAtom` will be poked on another interval `REQUESTS_INTERVAL`

When user decides to stop collecting data, several cleanups and resets must be called to out feature back into initial state. `SensorResourceAtom` must not send data after that. Feature will become inactive.

#### In-time structure

1. User starts recording
2. `collectedPointsAtom` set to add new point each `RECORD_UPDATES_INTERVAL`. Point being created with latest `sensorDataAtom` values based on latest coordinates data. No coordinates = no point added
3. Sensors set to store data in `sensorDataAtom`. Sensors started.
4. Geolocation set to store data in `sensorDataAtom` and trigger a request on each update. Geolocation started.
5. When request triggered - all collected points sent away. `collectedPointsAtom` resets to empty array and collect points based on new coordinates
