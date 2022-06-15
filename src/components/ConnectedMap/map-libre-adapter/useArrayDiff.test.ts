import { expect, test, describe } from 'vitest';
import { useArrayDiff } from './useArrayDiff';
import { renderHook } from '@testing-library/react-hooks';

describe('useArrayDiff effect must return difference between arrays', () => {
  test.todo("Investigate why it's hung");
  // test('Should return diff', () => {
  //   expect.assertions(6);
  //   const { result, rerender } = renderHook(() => useArrayDiff(['foo', 'bar', 'baz']));

  //   expect(result.current.added).toEqual(['foo', 'bar', 'baz']);
  //   expect(result.current.deleted).toEqual([]);
  //   rerender({ arr: ['foo', 'bar'] });
  //   expect(result.current.added).toEqual([]);
  //   expect(result.current.deleted).toEqual(['baz']);

  //   rerender({ arr: ['bag'] });
  //   expect(result.current.added).toEqual(['bag']);
  //   expect(result.current.deleted).toEqual(['foo', 'bar']);
  // });
});
