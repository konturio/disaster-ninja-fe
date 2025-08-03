import { describe, test, assert } from 'vitest';
import { hotProjectsLayout } from './hotProjectsLayout';

type LayoutNode = {
  [key: string]: any;
  children?: LayoutNode[];
  $template?: LayoutNode;
};

function findNode(
  node: LayoutNode,
  predicate: (n: LayoutNode) => boolean,
): LayoutNode | undefined {
  if (predicate(node)) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNode(child, predicate);
      if (found) return found;
    }
  }
  if (node.$template) {
    const found = findNode(node.$template, predicate);
    if (found) return found;
  }
  return undefined;
}

describe('hotProjectsLayout conditional elements', () => {
  test('mapping types are shown only for active card', () => {
    const mappingNode = findNode(
      hotProjectsLayout as unknown as LayoutNode,
      (n) => n.$value === 'mappingTypes',
    );
    assert(
      mappingNode,
      'Expected mapping types field node to be present in hotProjectsLayout',
    );
    assert.equal(
      mappingNode.$if,
      'active',
      `Mapping types field should be visible only when card is active, got condition: ${mappingNode.$if}`,
    );
  });

  test('open in Tasking Manager link is shown only for active card', () => {
    const linkNode = findNode(
      hotProjectsLayout as unknown as LayoutNode,
      (n) => n.label === 'Open in Tasking Manager',
    );
    assert(
      linkNode,
      'Expected Open in Tasking Manager link node to be present in hotProjectsLayout',
    );
    assert.equal(
      linkNode.$if,
      'active',
      `Open in Tasking Manager link should be visible only when card is active, got condition: ${linkNode.$if}`,
    );
  });
});
