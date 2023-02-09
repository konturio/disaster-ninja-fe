### Live sensor feature

This is a feature in development. It designed to collect user sensor data and send it to remote endpoint

#### Working logic

Feature is added to user interface throughout sidebar component.
For the first activation user will have to accept permissions for sensors.
After that each sensor will populate `sensorDataAtom` whenever possible.
Meanwhile `collectedPointsAtom` will collect geojson points created from sensor data in a given interval of `ADDING_POINTS_INTERVAL`.
`SensorResourceAtom` will be triggered to PUT request by `resourceTriggerAtom`, and populate it's payload from `collectedPointsAtom`. `resourceTriggerAtom` will be poked on another interval `REQUESTS_INTERVAL`

When user decides to stop collecting data, several cleanups and resets must be called to out feature back into initial state. `SensorResourceAtom` must not send data after that. Feature will become inactive.
