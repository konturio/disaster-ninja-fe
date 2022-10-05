/**
 * @vitest-environment happy-dom
 */
import { expect, test, describe, vi, beforeEach } from 'vitest';
// import { onDetailsUpdate } from './areaLayersLegendsAndSources';

// describe('Generate updated from state change diffs', () => {
//   test('First update diff', () => {
//     const diff = onDetailsUpdate({
//       dirty: false,
//       data: null,
//       error: null,
//       lastParams: null,
//       loading: false,
//     });

//     expect(diff).toEqual({
//       reset: [],
//       withError: [],
//       withLoading: [],
//       withData: [],
//     });
//   });

//   test('First loading state', () => {
//     const diff = onDetailsUpdate(
//       {
//         dirty: true,
//         data: null,
//         error: null,
//         lastParams: {
//           layersToRetrieveWithGeometryFilter: ['a', 'b'],
//           layersToRetrieveWithoutGeometryFilter: ['c', 'd'],
//         },
//         loading: true,
//       },
//       {
//         dirty: false,
//         data: null,
//         error: null,
//         lastParams: null,
//         loading: false,
//       },
//     );

//     expect(diff).toEqual({
//       reset: [],
//       withError: [],
//       withLoading: ['a', 'b', 'c', 'd'],
//       withData: [],
//     });
//   });
// });
