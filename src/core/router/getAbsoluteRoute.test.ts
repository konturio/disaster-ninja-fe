import { test, expect } from 'vitest';
import { getAbsoluteRoute } from './getAbsoluteRoute';

const basePathCases = ['/', '/active'];
const slugCases = ['', '/', '/slug', '/nested/slug'];

basePathCases.forEach((base) => {
  slugCases.forEach((slug) => {
    test(`Correct url for '${base}' + '${slug}'`, () => {
      expect(getAbsoluteRoute(slug, base)).toMatchSnapshot();
    });
  });
});
