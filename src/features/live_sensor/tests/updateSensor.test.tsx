/**
 * @vitest-environment happy-dom
 */

import { test, expect } from 'vitest';
import { updateSensor } from '../atoms/sensorData';

function getMockState() {
  return {
    accelX: [1, 2],
    accelY: [1, 1.12],
    accelZ: [null, 0],
    accelTime: [1000, 1002],
  };
}

test('test if length was increased properly', () => {
  const state = getMockState();
  const data = { accelX: 1, accelY: 2, accelZ: 1, accelTime: 1005 };

  const updated = updateSensor({
    data,
    mutableState: state,
    sensorKeys: ['accelX', 'accelY', 'accelZ', 'accelTime'],
    sensorTimes: state.accelTime,
    incomingTime: data.accelTime,
  });

  expect(updated?.accelX).toHaveLength(3);
  expect(updated?.accelY).toHaveLength(3);
  expect(updated?.accelZ).toHaveLength(3);
  expect(updated?.accelTime).toHaveLength(3);
});

test('test if correct values were added properly', () => {
  const state = getMockState();
  const data = { accelX: 1.23, accelY: 2, accelZ: 1, accelTime: 1005 };

  const updated = updateSensor({
    data,
    mutableState: state,
    sensorKeys: ['accelX', 'accelY', 'accelZ', 'accelTime'],
    sensorTimes: state.accelTime,
    incomingTime: data.accelTime,
  });
  // for new added value
  expect(updated?.accelX?.[2]).toBe(1.23);
  // for old value
  expect(updated?.accelY?.[1]).toBe(1.12);
  // for null value
  expect(updated?.accelZ?.[0]).toBeNull();
});

test('test if passed state was mutated', () => {
  const state = getMockState();
  const data = { accelX: 1.23, accelY: 2, accelZ: 1, accelTime: 1888 };

  updateSensor({
    data,
    mutableState: state,
    sensorKeys: ['accelX', 'accelY', 'accelZ', 'accelTime'],
    sensorTimes: state.accelTime,
    incomingTime: data.accelTime,
  });

  expect(state.accelTime).toHaveLength(3);
  expect(state.accelX).toHaveLength(3);
  expect(state.accelTime[2]).toBe(1888);
});
