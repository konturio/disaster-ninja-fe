import { setupTestContext } from '~utils/test_utils/setupTest';
import { parseLinksAsTags } from '~utils/markdown/parser';

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
  t.plan(3);

  const text = 'Lorem lorem [label](https://some.link)';
  const result = parseLinksAsTags(text);
  t.is(result, text);

  const text2 = '[Leading label](https://some.link) lorem lorem';
  const result2 = parseLinksAsTags(text2);
  t.is(result2, text2);

  const text3 = `Copernicus Global Land Service: Land Cover 100m: collection 3: epoch 2019: Globe (Version V3.0.1) Data set. Zenodo. [http://doi.org/10.5281/zenodo.3939050](http://doi.org/10.5281/zenodo.3939050)`;
  const result3 = parseLinksAsTags(text3);
  t.is(result3, text3);
});

test('have trailing slash', (t) => {
  const result = parseLinksAsTags('Lets have https://some.link/with-slash/');
  t.is(
    result,
    'Lets have [some.link/with-slash/](https://some.link/with-slash/)',
  );
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

test('real life case - newline, parenthesis and repeating', (t) => {
  const result = parseLinksAsTags(
    `This map shows visualization of survey results conducted by IOM (https://www.iom.int/) ...end of paragraph.
    https://www.iom.int, https://displacement.iom.int/reports`,
  );
  t.is(
    result,
    `This map shows visualization of survey results conducted by IOM ([www.iom.int/](https://www.iom.int/)) ...end of paragraph.
    [www.iom.int](https://www.iom.int), [displacement.iom.int/reports](https://displacement.iom.int/reports)`,
  );
});
