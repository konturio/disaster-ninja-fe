import { expect, test } from 'vitest';
import { createTree } from './createTree';

const fakeAtom = {} as any;
const getTestContext = () => {
  return {
    settings: {
      categoriesSettings: {},
      groupsSettings: {},
    },
  };
};

test('Empty registry', () => {
  const tree = createTree([], getTestContext().settings);
  expect(tree).toEqual({ children: [] });
});

test('Root layer', () => {
  const tree = createTree(
    [{ id: 'rootLayer', atom: fakeAtom }],
    getTestContext().settings,
  );

  expect(tree).toEqual({
    children: [{ id: 'rootLayer', atom: fakeAtom }],
  });
});

test('Layer in group', () => {
  const tree = createTree(
    [
      { id: 'layer_1', group: 'foo', atom: fakeAtom },
      { id: 'layer_2', group: 'bar', atom: fakeAtom },
      { id: 'layer_3', group: 'foo', atom: fakeAtom },
    ],
    getTestContext().settings,
  );

  expect(tree).toMatchObject({
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
  });
});

test('Layer in category and group', () => {
  const tree = createTree(
    [
      {
        id: 'layer_1',
        group: 'foo_group',
        category: 'foo_category',
        atom: fakeAtom,
      },
    ],
    getTestContext().settings,
  );

  expect(tree.children[0].id === 'foo_category').toBe(true);
  expect(tree.children[0].id === 'foo_category').toBe(true);
  // @ts-expect-error it's ok to fail this test if property undefined
  expect(tree.children[0].children[0].id === 'foo_group').toBe(true);
  // @ts-expect-error it's ok to fail this test if property undefined
  expect(tree.children[0].children[0].children[0].id === 'layer_1').toBe(true);
});

test('Integration - create correct tree', () => {
  expect(
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
      getTestContext().settings,
    ),
  ).toMatchSnapshot();
});

test('Tree apply group and category settings', () => {
  const tree = createTree(
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
  );

  const expectedResult = {
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
  };

  expect(tree).toMatchObject(expectedResult);
});
