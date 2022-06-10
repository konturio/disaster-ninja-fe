import { setupTestContext } from '../../../../utils/test_utils/setupTest';
import { createTree } from './createTree';

const fakeAtom = {} as any;
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
  t.deepEqual(
    createTree([{ id: 'rootLayer', atom: fakeAtom }], t.context.settings),
    {
      children: [{ id: 'rootLayer', atom: fakeAtom }],
    },
  );
});

test('Layer in group', (t) => {
  t.like(
    createTree(
      [
        { id: 'layer_1', group: 'foo', atom: fakeAtom },
        { id: 'layer_2', group: 'bar', atom: fakeAtom },
        { id: 'layer_3', group: 'foo', atom: fakeAtom },
      ],
      t.context.settings,
    ),
    {
      children: [
        {
          id: 'foo',
          isGroup: true,
          children: [
            { id: 'layer_1', group: 'foo', atom: fakeAtom },
            { id: 'layer_3', group: 'foo', atom: fakeAtom },
          ],
        },
        {
          id: 'bar',
          isGroup: true,
          children: [{ id: 'layer_2', group: 'bar', atom: fakeAtom }],
        },
      ],
    },
  );
});

test('Layer in category and group', (t) => {
  const tree = createTree(
    [
      {
        id: 'layer_1',
        group: 'foo_group',
        category: 'foo_category',
        atom: fakeAtom,
      },
    ],
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
        { id: 'rootLayer', atom: fakeAtom },
        {
          id: 'layer_1',
          group: 'foo_group',
          category: 'foo_category',
          atom: fakeAtom,
        },
        {
          id: 'layer_2',
          group: 'foo_group',
          category: 'foo_category',
          atom: fakeAtom,
        },
        {
          id: 'layer_3',
          group: 'foo_group',
          category: 'bar_category',
          atom: fakeAtom,
        },
        {
          id: 'layer_4',
          group: 'bar_group',
          category: 'bar_category',
          atom: fakeAtom,
        },
        { id: 'layer_5', group: 'bar_group', atom: fakeAtom },
      ],
      t.context.settings,
    ),
  );
});

test('Tree apply group and category settings', (t) => {
  t.like(
    createTree(
      [
        {
          id: 'layer_1',
          group: 'foo_group',
          category: 'foo_category',
          atom: fakeAtom,
        },
      ],
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
                {
                  id: 'layer_1',
                  group: 'foo_group',
                  category: 'foo_category',
                  atom: fakeAtom,
                },
              ],
            },
          ],
        },
      ],
    },
  );
});
