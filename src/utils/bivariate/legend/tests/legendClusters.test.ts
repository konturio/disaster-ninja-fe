import { clusterize, invertClusters } from '../legendClusters';
import { setupTestContext } from '../../../test_utils/setupTest';

const test = setupTestContext(() => ({}));
test('legendClusters tests', (t) => {
  t.log('TODO: Port me! ');
  t.pass();
});
// describe('legendClusters', () => {
//   it('clusterize() create multidimensional array from flat', () => {
//     const IN = [
//       { id: 'A1', color: '#e8e89d' },
//       { id: 'B1', color: '#ade4bf' },
//       { id: 'A2', color: '#e47f81' },
//       { id: 'B2', color: '#adad6c' },
//     ];

//     const EXPECTED = [
//       [
//         { id: 'A1', color: '#e8e89d' },
//         { id: 'A2', color: '#e47f81' },
//       ],
//       [
//         { id: 'B1', color: '#ade4bf' },
//         { id: 'B2', color: '#adad6c' },
//       ],
//     ];

//     expect(clusterize(IN)).toEqual(EXPECTED);
//   });

//   it('invertClusters() invert clusters order', () => {
//     const IN = [
//       { id: 'A1', color: '#e8e89d' },
//       { id: 'A2', color: '#e47f81' },
//       { id: 'B1', color: '#ade4bf' },
//       { id: 'B2', color: '#adad6c' },
//     ];

//     const EXPECTED = [
//       { id: 'B1', color: '#ade4bf' },
//       { id: 'B2', color: '#adad6c' },
//       { id: 'A1', color: '#e8e89d' },
//       { id: 'A2', color: '#e47f81' },
//     ];

//     expect(invertClusters(IN)).toEqual(EXPECTED);
//   });
// });
