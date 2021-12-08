import { setupTestContext } from '../../../../utils/testsUtils/setupTest';
import { createTree } from './createTree';

const test = setupTestContext(() => {
  return {
    settings: {
      categoriesSettings: {},
      groupsSettings: {},
    },
  };
});

test('Empty registry', (t) => {
  t.deepEqual(createTree([], t.context.settings), { children: [] });
});

test('Root layer', (t) => {
  t.deepEqual(createTree([{ id: 'rootLayer' }], t.context.settings), {
    children: [{ id: 'rootLayer' }],
  });
});

test('Layer in group', (t) => {
  t.like(
    createTree(
      [
        { id: 'layer_1', group: 'foo' },
        { id: 'layer_2', group: 'bar' },
        { id: 'layer_3', group: 'foo' },
      ],
      t.context.settings,
    ),
    {
      children: [
        {
          id: 'foo',
          isGroup: true,
          children: [
            { id: 'layer_1', group: 'foo' },
            { id: 'layer_3', group: 'foo' },
          ],
        },
        {
          id: 'bar',
          isGroup: true,
          children: [{ id: 'layer_2', group: 'bar' }],
        },
      ],
    },
  );
});

test('Layer in category and group', (t) => {
  const tree = createTree(
    [{ id: 'layer_1', group: 'foo_group', category: 'foo_category' }],
    t.context.settings,
  );
  t.true(tree.children[0].id === 'foo_category');
  // @ts-expect-error it's ok to fail this test if property undefined
  t.true(tree.children[0].children[0].id === 'foo_group');
  // @ts-expect-error it's ok to fail this test if property undefined
  t.true(tree.children[0].children[0].children[0].id === 'layer_1');
});

test('Integration - create correct tree', (t) => {
  t.snapshot(
    createTree(
      [
        { id: 'rootLayer' },
        { id: 'layer_1', group: 'foo_group', category: 'foo_category' },
        { id: 'layer_2', group: 'foo_group', category: 'foo_category' },
        { id: 'layer_3', group: 'foo_group', category: 'bar_category' },
        { id: 'layer_4', group: 'bar_group', category: 'bar_category' },
        { id: 'layer_5', group: 'bar_group' },
      ],
      t.context.settings,
    ),
  );
});

test('Tree apply group and category settings', (t) => {
  t.like(
    createTree(
      [{ id: 'layer_1', group: 'foo_group', category: 'foo_category' }],
      {
        categoriesSettings: {
          foo_category: {
            name: 'Foo category',
            order: 3,
            openByDefault: false,
            mutuallyExclusive: false,
          },
        },
        groupsSettings: {
          foo_group: {
            name: 'Foo group',
            order: 5,
            openByDefault: true,
            mutuallyExclusive: true,
          },
        },
      },
    ),
    {
      children: [
        {
          id: 'foo_category',
          name: 'Foo category',
          isCategory: true,
          order: 3,
          openByDefault: false,
          mutuallyExclusive: false,
          children: [
            {
              id: 'foo_group',
              name: 'Foo group',
              isGroup: true,
              order: 5,
              openByDefault: true,
              mutuallyExclusive: true,
              children: [
                { id: 'layer_1', group: 'foo_group', category: 'foo_category' },
              ],
            },
          ],
        },
      ],
    },
  );
});
