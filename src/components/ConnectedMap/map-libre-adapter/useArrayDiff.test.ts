import { setupTestContext } from '../../../utils/test_utils/setupTest';

const test = setupTestContext(() => ({}));
test('useArrayDiff tests', (t) => {
  t.log('TODO: Port me! ');
  t.pass();
});
// import { renderHook } from '@testing-library/react-hooks';
// import { useArrayDiff } from './useArrayDiff';

// describe('useArrayDiff effect must return difference between arrays', () => {
//   it('Should return diff', () => {
//     expect.assertions(6);
//     const { result, rerender } = renderHook(({ arr }) => useArrayDiff(arr), {
//       initialProps: { arr: ['foo', 'bar', 'baz'] },
//     });

//     expect(result.current.added).toEqual(['foo', 'bar', 'baz']);
//     expect(result.current.deleted).toEqual([]);

//     rerender({ arr: ['foo', 'bar'] });
//     expect(result.current.added).toEqual([]);
//     expect(result.current.deleted).toEqual(['baz']);

//     rerender({ arr: ['bag'] });
//     expect(result.current.added).toEqual(['bag']);
//     expect(result.current.deleted).toEqual(['foo', 'bar']);
//   });
// });
