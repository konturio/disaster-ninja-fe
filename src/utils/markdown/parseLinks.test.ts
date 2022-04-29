import { setupTestContext } from '~utils/testsUtils/setupTest';
import { parseLinksAsTags } from './parsers';

/* Setup stage */
const test = setupTestContext(() => {
  return {};
});

/* Test cases */

test('do not transform simple text', (t) => {
  const text = 'Lorem lorem';
  const result = parseLinksAsTags(text);
  t.is(result, text);
});

test('do not transform propper marked link', (t) => {
  t.plan(2);

  const text = 'Lorem lorem [label](https://some.link)';
  const result = parseLinksAsTags(text);
  t.is(result, text);

  const text2 = '[Leading label](https://some.link) lorem lorem';
  const result2 = parseLinksAsTags(text2);
  t.is(result2, text2);
});

test('Transform inline links to markdown link format', (t) => {
  t.plan(4);

  const result1 = parseLinksAsTags('Lorem lorem https://some.link');
  t.is(result1, 'Lorem lorem [some.link](https://some.link)');

  const result2 = parseLinksAsTags('https://some.link lorem lorem');
  t.is(result2, '[some.link](https://some.link) lorem lorem');

  const result3 = parseLinksAsTags(
    'https://some.link/with-path and following text',
  );
  t.is(
    result3,
    '[some.link/with-path](https://some.link/with-path) and following text',
  );

  const result4 = parseLinksAsTags(
    'Leading text https://some.link/with-path/that-is-verbose',
  );
  t.is(
    result4,
    'Leading text [some.link/with-path/that-is-verbose](https://some.link/with-path/that-is-verbose)',
  );
});

test('Transform multiple links to markdown link format', (t) => {
  t.plan(2);

  const result1 = parseLinksAsTags(
    'Lorem lorem https://some.link and http://with.some/other-link',
  );
  t.is(
    result1,
    'Lorem lorem [some.link](https://some.link) and [with.some/other-link](http://with.some/other-link)',
  );

  const result2 = parseLinksAsTags(
    'https://some.link http://another.link/with-path',
  );
  t.is(
    result2,
    '[some.link](https://some.link) [another.link/with-path](http://another.link/with-path)',
  );
});
