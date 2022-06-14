import { expect, test } from 'vitest';
import { sortChildren } from './sortTree';
import type { TreeChildren } from '~core/types/layers';

const fakeAtom = {} as any;
const getTestContext = () => {
  return {
    getIds: (arr: { id: string }[]) => arr.map((a) => a.id),
    sorterSettings: {
      order: ['isGroup', 'isCategory'],
      inClusterSortField: 'order',
    },
  };
};

test('Layers without category and groups go first', () => {
  const children: TreeChildren[] = [
    { id: 'testGroup', isGroup: true },
    { id: 'testCategory', isCategory: true },
    { id: 'rootLayer' },
  ] as TreeChildren[];

  const sorted = sortChildren(children, getTestContext().sorterSettings);
  expect(getTestContext().getIds(sorted)[0]).toEqual('rootLayer');
});

test('Groups without category and groups go first', () => {
  const children = [
    { id: 'testCategory_2', isCategory: true },
    { id: 'rootGroup', isGroup: true },
    { id: 'testCategory', isCategory: true },
  ] as TreeChildren[];
  const sorted = sortChildren(children, getTestContext().sorterSettings);
  expect(getTestContext().getIds(sorted)[0]).toEqual('rootGroup');
});

test('Sort children recursively', () => {
  const children: TreeChildren[] = [
    {
      id: 'parenCategory',
      isCategory: true,
      children: [{ id: 'rootGroup', isGroup: true }, { id: 'rootLayer' }],
    },
  ] as TreeChildren[];
  const sorted = sortChildren(children, getTestContext().sorterSettings);

  // @ts-expect-error - we clearly see above that single item is category, no check needed
  expect(getTestContext().getIds(sorted[0].children)[0]).toEqual('rootLayer');
});

test('Ignore other boolean properties', () => {
  const children: TreeChildren[] = [
    {
      id: 'testGroup',
      isGroup: true,
    },
    {
      id: 'testCategory',
      isCategory: true,
    },
    { id: 'rootLayer' },
  ] as TreeChildren[];

  const sorted = sortChildren(children, getTestContext().sorterSettings);
  expect(getTestContext().getIds(sorted)[0]).toEqual('rootLayer');
});

test('Use order property for sort similar types', () => {
  const children: TreeChildren[] = [
    {
      id: 'testGroup',
      isGroup: true,
    },
    {
      id: 'testCategory3',
      isCategory: true,
      order: 2,
    },
    {
      id: 'testCategory1',
      isCategory: true,
      order: 0,
    },
    {
      id: 'testCategory2',
      isCategory: true,
      order: 1,
    },
  ] as TreeChildren[];

  const sorted = sortChildren(children, getTestContext().sorterSettings);
  expect(getTestContext().getIds(sorted)[1]).toEqual('testCategory1');
});

test('Ignore order for different types', () => {
  const children: TreeChildren[] = [
    {
      id: 'testGroup1',
      isGroup: true,
      order: 3,
    },
    {
      id: 'testCategory3',
      isCategory: true,
      order: 2,
    },
    {
      id: 'testGroup2',
      isGroup: true,
      order: 4,
    },
    {
      id: 'testCategory2',
      isCategory: true,
      order: 1,
    },
  ] as TreeChildren[];

  const sorted = sortChildren(children, getTestContext().sorterSettings);
  expect(getTestContext().getIds(sorted)[0]).toEqual('testGroup1');
});

test('Not loose layers after sort', () => {
  const children: TreeChildren[] = [
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
  ] as TreeChildren[];

  const countChildren = (children) =>
    children.reduce((acc, c) => {
      acc += 1;
      if (c.children) {
        acc += countChildren(c.children);
      }
      return acc;
    }, 0);

  const sorted = sortChildren(children, getTestContext().sorterSettings);
  expect(countChildren(children)).toEqual(countChildren(sorted));
});
