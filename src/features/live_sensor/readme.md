### Live sensor feature

This is a feature in development. It designed to collect user sensor data and send it to remote endpoint

#### Working logic

Feature is added to user interface throughout sidebar component.
For the first activation user will have to accept permissions for sensors.
After that each sensor will populate `sensorDataAtom` with updated data in given interval.
`SensorResourceAtom` will follow `sensorDataAtom` updates and will send data in desired interval.
When user decides to stop collecting data, `sensorDataAtom` will call `.resetSensorData()`. `SensorResourceAtom` will not send data after that. Feature will become inactive.
