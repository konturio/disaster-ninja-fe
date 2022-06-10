import { sortByExample } from '../sortByExample';
import { setupTestContext } from '../../../../test_utils/setupTest';

const test = setupTestContext(() => ({}));
test('sortByExample tests', (t) => {
  t.log('TODO: Port me! ');
  t.pass();
});

// describe('sortByExample', () => {
//   it('Should sort same items according example', () => {
//     const EXAMPLE = ['foo', 'bar', 'baz', 'same', 'bug'];
//     const CASE = ['bar', 'foo', 'bug', 'same', 'baz'];
//     CASE.sort(sortByExample(EXAMPLE));
//     expect(CASE).toEqual(EXAMPLE);
//   });

//   it('Should add unexpected items to and of array', () => {
//     const EXAMPLE = ['foo', 'bar', 'baz'];
//     const CASE = ['foo', 'bar', 'unexpected', 'baz'];
//     CASE.sort(sortByExample(EXAMPLE));
//     expect(CASE.pop()).toBe('unexpected');
//   });
// });
