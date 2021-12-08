import { setupTestContext } from '../../../../utils/testsUtils/setupTest';
import { sortChildren } from './sortTree';

const test = setupTestContext(() => {
  return {
    getIds: (arr: { id: string }[]) => arr.map((a) => a.id),
    sorterSettings: {
      order: ['isGroup', 'isCategory'],
      inClusterSortField: 'order',
    },
  };
});

test('Layers without category and groups go first', (t) => {
  const children = [
    { id: 'testGroup', isGroup: true },
    { id: 'testCategory', isCategory: true },
    { id: 'rootLayer' },
  ];

  const sorted = sortChildren(children, t.context.sorterSettings);
  t.deepEqual(t.context.getIds(sorted)[0], 'rootLayer');
});

test('Groups without category and groups go first', (t) => {
  const children = [
    { id: 'testCategory_2', isCategory: true },
    { id: 'rootGroup', isGroup: true },
    { id: 'testCategory', isCategory: true },
  ];
  const sorted = sortChildren(children, t.context.sorterSettings);
  t.deepEqual(t.context.getIds(sorted)[0], 'rootGroup');
});

test('Sort children recursively', (t) => {
  const children = [
    {
      id: 'parenCategory',
      isCategory: true,
      children: [{ id: 'rootGroup', isGroup: true }, { id: 'rootLayer' }],
    },
  ];
  const sorted = sortChildren(children, t.context.sorterSettings);

  // @ts-expect-error - we clearly see above that single item is category, no check needed
  t.deepEqual(t.context.getIds(sorted[0].children)[0], 'rootLayer');
});

test('Ignore other boolean properties', (t) => {
  const children = [
    { id: 'testGroup', isGroup: true },
    { id: 'testCategory', isCategory: true },
    { id: 'rootLayer', isA: true },
  ];

  const sorted = sortChildren(children, t.context.sorterSettings);
  t.deepEqual(t.context.getIds(sorted)[0], 'rootLayer');
});

test('Use order property for sort similar types', (t) => {
  const children = [
    { id: 'testGroup', isGroup: true },
    { id: 'testCategory3', isCategory: true, order: 2 },
    { id: 'testCategory1', isCategory: true, order: 0 },
    { id: 'testCategory2', isCategory: true, order: 1 },
  ];

  const sorted = sortChildren(children, t.context.sorterSettings);
  t.deepEqual(t.context.getIds(sorted)[1], 'testCategory1');
});

test('Ignore order for different types', (t) => {
  const children = [
    { id: 'testGroup1', isGroup: true, order: 3 },
    { id: 'testCategory3', isCategory: true, order: 2 },
    { id: 'testGroup2', isGroup: true, order: 4 },
    { id: 'testCategory2', isCategory: true, order: 1 },
  ];

  const sorted = sortChildren(children, t.context.sorterSettings);
  t.deepEqual(t.context.getIds(sorted)[0], 'testGroup1');
});

test('Not loose layers after sort', (t) => {
  const children = [
    { id: 'rootLayer' },
    {
      children: [
        {
          children: [
            {
              category: 'foo_category',
              group: 'foo_group',
              id: 'layer_1',
            },
            {
              category: 'foo_category',
              group: 'foo_group',
              id: 'layer_2',
            },
          ],
          id: 'foo_group',
          isGroup: true,
        },
      ],
      id: 'foo_category',
      isCategory: true,
    },
    {
      children: [
        {
          children: [
            {
              category: 'bar_category',
              group: 'foo_group',
              id: 'layer_3',
            },
          ],
          id: 'foo_group',
          isGroup: true,
        },
        {
          children: [
            {
              category: 'bar_category',
              group: 'bar_group',
              id: 'layer_4',
            },
          ],
          id: 'bar_group',
          isGroup: true,
        },
      ],
      id: 'bar_category',
      isCategory: true,
    },
    {
      children: [
        {
          group: 'bar_group',
          id: 'layer_5',
        },
      ],
      id: 'bar_group',
      isGroup: true,
    },
  ];

  const countChildren = (children) =>
    children.reduce((acc, c) => {
      acc += 1;
      if (c.children) {
        acc += countChildren(c.children);
      }
      return acc;
    }, 0);

  const sorted = sortChildren(children, t.context.sorterSettings);
  t.deepEqual(countChildren(children), countChildren(sorted));
});
