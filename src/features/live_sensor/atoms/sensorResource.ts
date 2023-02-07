import { apiClient } from '~core/apiClientInstance';
import { createAtom } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import { createNumberAtom } from '~utils/atoms/createPrimitives';
import { REQUESTS_INTERVAL, UPDATE_ENDPOINT_PATH } from '../constants';
import { sensorDataAtom } from './sensorData';
import type { SensorDataAtomType } from './sensorData';

// Here we want to send data every each REQUESTS_INTERVAL
// Why not send it on every sensor update?
// Consider situation - we have sensors A, B
// Sensor A setted update, in 10 milliseconds sensor B setted update - we have 2 requests
// and exceeded expected requests interval

// export function clearRequestsInterval() {
//   const interval = setInterval(() => {
//     'do request here'

//   }, REQUESTS_INTERVAL)
// }

// Is it okay we skip createAsyncAtom?
// export const sensorResourceAtom = createAtom(
//   {
//     startTransmission: () => null,
//     stopTransmission: () => null,
//   },
//   ({ onAction, getUnlistedState }, state: null | NodeJS.Timer = null) => {
//     const sensorData = getUnlistedState(sensorDataAtom)

//     onAction('startTransmission', () => {
//       if (!sensorData) return;

//       const interval = setInterval(async () => {
//         await apiClient.post(
//           UPDATE_ENDPOINT_PATH,
//           {
//             ...sensorData
//           },
//           true,
//         )
//       }, REQUESTS_INTERVAL)
//       state = interval
//     })

//     onAction('stopTransmission', () => {
//       if (state) clearInterval(state)
//     })

//     return state
//   }
// )

// What if we create depsAtom, that is lazily subscribed to sensorData and updates it's state every interval?

// export const resourceDepsAtom = createAtom(
//   {
//     startWatching: () => null,
//     stopUpdates: () => null,
//     _restart: () => null,
//   },
//   // or should state be {data, interval: number}?
//   ({ onAction, getUnlistedState, create, schedule }, state: SensorDataAtomType | null = null) => {
//     const sensorData = getUnlistedState(sensorDataAtom)

//     onAction('startWatching', () => {

//       // if (!sensorData) return;

//       // const interval = setInterval(async () => {
//       //   await apiClient.post(
//       //     UPDATE_ENDPOINT_PATH,
//       //     {
//       //       ...sensorData
//       //     },
//       //     true,
//       //   )
//       // }, REQUESTS_INTERVAL)
//       // state = interval
//       schedule(dispatch => {
//         const timeout = setTimeout(() => {
//           dispatch(create('_restart'))
//         }, REQUESTS_INTERVAL);
//       })
//     })

//     onAction('stopUpdates', () => {
//       // if (state) clearInterval(state)
//     })

//     onAction('_restart', () => {
//       return state
//     })

//     return state
//   }
// )

// what if we create counter atom
export const resourceTriggerAtom = createNumberAtom(0);
// subscribe to its change on deps atom and silently sub on data atom
export const resourceDepsAtom = createAtom(
  {
    resourceTriggerAtom,
  },
  ({ get, getUnlistedState }, state: SensorDataAtomType | null = null) => {
    const trigger = get('resourceTriggerAtom');
    if (trigger === 0) return state;

    state = getUnlistedState(sensorDataAtom);
    // debug
    if (!(trigger % 5)) alert(JSON.stringify(state || {}));

    return state;
  },
);
// start incrementing counter on app

export const sensorResourceAtom = createAsyncAtom(
  resourceDepsAtom,
  async (sensorData, abortController) => {
    return await apiClient.post(
      UPDATE_ENDPOINT_PATH,
      {
        ...sensorData,
      },
      true,
      {
        signal: abortController.signal,
      },
    );
  },
  'Sensor resource atom',
);
