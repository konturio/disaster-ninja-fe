# Maintainable design for the `Uni` components, focusing on the container/item relationship.

**Current Situation Analysis**

-   We have `UniElementsMap` that acts as a registry of all possible elements.
-   `UniCardCfg` defines the structure of a card, including an array of `items`.
-   `UniCardItem` is a union type that can represent any of the registered elements, either in shorthand (just `value`) or full props form.
-   `isValidUniElement` checks if an item is valid based on its structure.
-   `UniCard` renders the card by iterating over `items`, normalizing them, and rendering the corresponding component from `UniElementsMap`.
-   Several components like `ActionButtons`, `IconList`, `Label`, `Progress`, `Table` act as "containers" for lists of items.  Others, like `Title`, `CardText`, and `SeverityElement`, are single-item elements.

**Problems and Goals**

1.  **Redundancy:** The container components (`ActionButtons`, `IconList`, `Label`, `Progress`, `Table`) have their own styling and mapping logic, leading to duplicated code.
2.  **Scalability:** Adding new container types requires modifying multiple files (`UniElementsMap`, `UniCardItem`, `UniCard`, potentially CSS).
3.  **Consistency:**  Ensuring consistent styling and behavior across containers is difficult.
4.  **Flexibility:**  The current structure isn't very flexible for composing elements within containers (e.g., nesting containers).

**Proposed Solution: Abstract Container/Item Pattern**

The core idea is to create a generic `ListContainer` component and a corresponding `ListItem` type. This will handle the common logic of rendering lists, while individual item types can still have their specific rendering and styling.

Here's a breakdown of the changes:

1.  **`ListContainer` Component:**
    *   Takes a `value` prop, which is an array of `ListItem` objects.
    *   Takes an `itemComponent` prop: a React component that renders a single item.
    *   Handles the mapping and rendering of the list items, applying common container styles.
    *   Provides default styling (e.g., flex layout, gap) but allows overrides.

2.  **`ListItem` Type:**
    *   A generic type that defines the basic structure of an item within a list.
    *   Can be extended by specific item types (e.g., `LabelItem`, `ActionItem`).

3.  **Update `UniElementsMap`:**
    *   Add `list` as a new `UniElementId`.
    *   The value of `list` will be an object containing `items` (array of `ListItem` or its extensions) and `itemType` (string, referencing another key in `UniElementsMap`).

4.  **Update `UniCardItem`:**
    *   Include the new `list` type, specifying its structure.

5.  **Update `UniCard`:**
    *   Handle the `list` type by rendering the `ListContainer` with the appropriate `itemComponent`.

6.  **Refactor Existing Containers:**
    *   `Label`, `ActionButtons`, `IconList`, `Progress`, `Table` become simple components that render *individual items*.
    *   Their previous container logic is moved to `ListContainer`.
    *   Their corresponding CSS Modules are adjusted accordingly.

**Code Examples (Illustrative)**

A.1> Explanation of changes to `src/components/Uni/Elements/index.ts`

C.1.1> Add `ListContainer` to `UniElementsMap`.
C.1.2> Define `ListItem` and update `UniCardItem` to include the `list` type.
C.1.3> Update `isValidUniElement` to handle the new `list` type.

```typescript:src/components/Uni/Elements/index.ts
import { SeverityElement } from './Severity';
import { ActionButtons, IconList } from './ActionButtons';
import { Title } from './Title';
import { Table } from './Table';
import { Label } from './Label';
import { Progress } from './Progress';
import { CardText } from './CardText';
import type { LngLatBoundsLike } from 'maplibre-gl';
import { ListContainer } from './ListContainer'; // C.1.1

// add new card elements here
export const UniElementsMap = {
  label: Label,
  title: Title,
  table: Table,
  actions: ActionButtons,
  icl: IconList,
  progress: Progress,
  text: CardText,
  severity: SeverityElement,
  list: ListContainer, // C.1.1
};

export type UniElementId = keyof typeof UniElementsMap;

type InferProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type UniCardCfg = {
  id: string;
  focus?: LngLatBoundsLike;
  properties: object;
  items: UniCardItem[];
};

type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;
type ElementValueType<T> = ComponentProps<T> extends { value: infer V } ? V : never;

// C.1.2 Define ListItem
export type ListItem<T extends UniElementId = UniElementId> = {
  type: T;
  props: ComponentProps<(typeof UniElementsMap)[T]>;
};

export type UniCardItem =
  | {
      [K in UniElementId]:
        | { [P in K]: ElementValueType<(typeof UniElementsMap)[K]> } // Shorthand
        | { [P in K]: ComponentProps<(typeof UniElementsMap)[K]> }; // Full props
    }[UniElementId]
  | {
      list: { // C.1.2
        itemType: UniElementId;
        items: ListItem[];
      };
    };

export function isValidUniElement(
  item: Record<UniElementId, unknown>,
  type: UniElementId,
): item is Record<UniElementId, { value: any }> {
  if (type === 'list') { // C.1.3
    return (
      type in item &&
      typeof item[type] === 'object' &&
      item[type] !== null &&
      'itemType' in item[type] &&
      typeof item[type].itemType === 'string' &&
      'items' in item[type] &&
      Array.isArray(item[type].items)
    );
  }
  return (
    type in item && typeof item[type] === 'object' && 'value' in (item[type] as object)
  );
}

```

A.2> Explanation of changes to `src/components/Uni/UniCard.tsx`

C.2.1> Handle the `list` type in the main rendering loop.  It retrieves the `itemType` and uses that to look up the correct component in `UniElementsMap`.

```typescript:src/components/Uni/UniCard.tsx
import { clsx } from 'clsx';
import { isValidUniElement, UniElementsMap } from './Elements';
import s from './UniCard.module.css';
import type { UniElementId, UniCardCfg } from './Elements';

export function UniCard({
  feature,
  isActive,
  onClick,
}: {
  feature: UniCardCfg;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <div className={clsx(s.card, isActive && s.selected)} onClick={onClick} tabIndex={0}>
      {feature.items.map((item, idx) => {
        // Normalize string shorthand to object format
        const normalizedItem = Object.entries(item).reduce(
          (acc, [key, value]) => {
            // String shorthand normalization
            if (typeof value === 'string') {
              acc[key as UniElementId] = { value };
            }
            // Array shorthand normalization (e.g., labels: ['A', 'B'])
            else if (
              Array.isArray(value)
              // && value.every((item) => typeof item === 'string')
            ) {
              // acc[key as UniElementId] = { value: value.map((v) => ({ value: v })) };
              acc[key as UniElementId] = { value };
            }
            // Preserve object syntax
            else {
              acc[key as UniElementId] = value;
            }
            return acc;
          },
          {} as Record<UniElementId, any>,
        );
        console.log({ idx, item, normalizedItem });

        const [elementType] = Object.keys(normalizedItem) as UniElementId[];
        if (!elementType || !isValidUniElement(normalizedItem, elementType)) {
          console.warn('Invalid UniCard item:', normalizedItem);
          return null;
        }

        // C.2.1 Handle list type
        if (elementType === 'list') {
          const { itemType, items } = normalizedItem.list;
          const ItemComponent = UniElementsMap[itemType];
          if (!ItemComponent) {
            console.warn(`Invalid itemType in list: ${itemType}`);
            return null;
          }
          return (
            <ListContainer
              key={`list-${idx}`}
              itemComponent={ItemComponent}
              items={items}
            />
          );
        }

        const Component = UniElementsMap[elementType];
        const props = normalizedItem[elementType];
        return <Component key={`${elementType}-${idx}`} {...props} />;
      })}
    </div>
  );
}

```

A.3> Explanation of creating `src/components/Uni/Elements/ListContainer.tsx`

C.3.1> Create the `ListContainer` component.  This component receives `items` and `itemComponent` as props. It maps over the `items` and renders the `itemComponent` for each.

```typescript:src/components/Uni/Elements/ListContainer.tsx
import React from 'react';
import s from './ListContainer.module.css'; // You'll create this CSS file
import type { ListItem } from './index';

type ListContainerProps = {
  items: ListItem[];
  itemComponent: React.ComponentType<any>; // Accepts any component
  className?: string; // For custom styling
};

export function ListContainer({
  items,
  itemComponent: ItemComponent,
  className,
}: ListContainerProps) {
  return (
    <div className={`${s.listContainer} ${className || ''}`}>
      {items.map((item, index) => (
        <ItemComponent key={index} {...item.props} />
      ))}
    </div>
  );
}

```

```css:src/components/Uni/Elements/ListContainer.module.css
.listContainer {
  display: flex;
  /* Add common styles for all lists here, e.g., gap, flex-direction */
  gap: var(--half-unit);
  /* ... other default styles ... */
}

/* Add specific styles for different list types if needed, e.g., */
.labelsList {
  /* ... styles specific to label lists ... */
}

.actionsList {
  /* ... styles specific to action button lists ... */
}

/* ... and so on ... */

```

A.4> Explanation of refactoring `src/components/Uni/Elements/Label.tsx`

C.4.1> Refactor `Label` to render a *single* label item. The container logic is now handled by `ListContainer`.

```typescript:src/components/Uni/Elements/Label.tsx
import s from './Label.module.css';

type LabelItem = {
  value: string;
  color?: string;
  backgroundColor?: string;
};

// Now, LabelProps represents a SINGLE label, not a list
export interface LabelProps {
  value: string; // Changed to single value
  color?: string;
  backgroundColor?: string;
}

// Label component now renders a single item
export function Label({ value, color, backgroundColor }: LabelProps) {
  const style = {};
  if (color) style['color'] = color;
  if (backgroundColor) style['backgroundColor'] = backgroundColor;
  return (
    <div style={style} className={s.labelItem}>
      {value}
    </div>
  );
}

```

```css:src/components/Uni/Elements/Label.module.css
/* Previous .labelsList styles are moved to ListContainer.module.css */

.labelItem {
  /* Styles for a SINGLE label item */
  background-color: var(--faint-weak);
  color: var(--base-strong);
  padding: var(--half-unit) var(--unit);
  border-radius: var(--double-unit);
  font: 500 var(--font-xs);
}

```

A.5> Explanation of refactoring `src/components/Uni/Elements/ActionButtons.tsx`

C.5.1> Refactor `ActionButtons` to render a single action button.

```typescript:src/components/Uni/Elements/ActionButtons.tsx
import { SimpleTooltip } from '@konturio/floating';
import { Icon } from '~components/Icon';
import s from './ActionButtons.module.css';

export type ActionItem =
  | {
      type: 'external_link';
      title: string;
      data: string;
    }
  | {
      type: 'fsa';
      title: string;
      icon?: Parameters<typeof Icon>[0]['icon'];
      data: string;
    };

// ActionButtons component now renders a SINGLE item
export function ActionButtons(props: ActionItem) {
  if (props.type == 'external_link') {
    return (
      <a href={props.data || '#'} target="_blank" rel="noreferrer" className={s.actionItem}>
        <Icon icon="ExternalLink16" />
        {props.title}
      </a>
    );
  }

  if (props.type == 'fsa') {
    return (
      <a href={props.data || '#'} className={s.actionItem}>
        {props.icon && <Icon icon={props.icon} />}
        {props.title}
      </a>
    );
  }

  return null;
}

export type IconListItem = {
  title: string;
  icon: Parameters<typeof Icon>[0]['icon'];
  alt?: string;
  data?: string;
};

// IconList component now renders a SINGLE item
export function IconList(props: IconListItem) {
  const { alt, icon, title } = props;
  const comp = (
    <div className={`uni_iconlist_item ${s.actionItem}`}>
      {icon && <Icon icon={icon} />} {title}
    </div>
  );
  const res = alt ? (
    <SimpleTooltip content={alt} placement="top">
      {comp}
    </SimpleTooltip>
  ) : (
    comp
  );
  return res;
}

```

```css:src/components/Uni/Elements/ActionButtons.module.css
/* Previous .actions styles are moved to ListContainer.module.css */

.actionItem {
  /* Styles for a SINGLE action item */
  color: var(--accent-strong);
  font: 500 var(--font-xs);
  text-decoration: none;
  display: block; /* Or inline-block, depending on desired layout */
}

.actionItem:hover {
  outline: 1px solid var(--accent-strong);
  outline-offset: 4px;
}
.actionItem > svg {
    vertical-align: bottom;
}

```

A.6> Explanation of refactoring other container components (`Progress`, `Table`)

The other container components (`Progress`, `Table`) would be refactored similarly.  Their `...Props` interfaces would change to represent a single item, and their rendering logic would be updated to render only that single item. The container styling would move to `ListContainer.module.css`.

A.7> Explanation of changes to `src/components/Uni/UniCard.fixture.tsx`

C.7.1> Update the fixture to use the new `list` structure.

```typescript:src/components/Uni/UniCard.fixture.tsx
import { UniCard } from './UniCard';
import type { UniCardCfg, UniCardItem } from './Elements';

const _test_uni_item_types: UniCardCfg = {
  items: [
    { label: { value: [{ value: '2' }] } },
    // { label: ['A'] }, // Invalid - remove shorthand array
    {
      list: {
        itemType: 'label',
        items: [{ type: 'label', props: { value: 'A' } }],
      },
    },
    { progress: { value: [{ title: '', value: 0, color: '' }] } },
    // { progress: [{ title: '', value: 0, color: '' }] }, // Invalid - remove shorthand array
    {
      list: {
        itemType: 'progress',
        items: [
          { type: 'progress', props: { title: '', value: 0, color: '' } },
        ],
      },
    },
    { title: { value: '' } },
    { title: '' },
    {
      // table: [ // Invalid - remove shorthand array
      //   ['a', 'b'],
      //   ['a2', 'b2'],
      // ],
      list: {
        itemType: 'table',
        items: [
          { type: 'table', props: { value: ['a', 'b'] } },
          { type: 'table', props: { value: ['a2', 'b2'] } },
        ],
      },
    },
  ],
};

export default {
  UniCard_event: <UniCard key="1" feature={_getEventMock()} isActive />,
  UniCard_test: <UniCard key="1" feature={_test_uni_item_types} />,
};

function _getEventMock() {
  const c: UniCardCfg = {
    id: 'f84f21e0-65c9-48e0-8e37-f43dab2777f5',
    focus: [98.1180632, -10.2927858, 140.76358974504504, 4.2304443],
    properties: {
      eventId: 'f84f21e0-65c9-48e0-8e37-f43dab2777f5',
      eventName: 'Flood',
      eventType: 'FLOOD',
      description:
        'On 17/11/2024, a flood started in Indonesia, lasting until 12/02/2025 (last update). The flood caused 37 deaths and 4190 displaced .',
      location: 'Indonesia',
      severity: 'MODERATE',
      affectedPopulation: 130969671,
      settledArea: 10031.986031753553,
      osmGaps: 3,
      startedAt: '2024-11-17T01:00:00Z',
      updatedAt: '2025-02-11T15:46:01.944Z',
      externalUrls: [
        'https://www.gdacs.org/report.aspx?eventtype=FL&eventid=1103025',
        'https://www.gdacs.org/report.aspx?eventid=1103025&episodeid=44&eventtype=FL',
      ],
      bbox: [98.1180632, -10.2927858, 140.76358974504504, 4.2304443],
      centroid: [98.8796722168584, 1.1440190000000001],
      episodeCount: 1,
    },
    items: [
      {
        severity: 'MODERATE',
      },
      {
        title: 'Flood',
      },
      {
        text: 'Indonesia',
      },
      {
        // icl: [ // Invalid - remove shorthand array
        //   {
        //     title: '130,969,671',
        //     alt: 'Affected people',
        //     data: '',
        //     icon: 'People16',
        //   },
        //   {
        //     title: '10,032 km²',
        //     alt: 'Settled area',
        //     icon: 'Area16',
        //   },
        //   {
        //     title: '3%',
        //     alt: 'Osm Gaps',
        //     icon: 'OsmGaps16',
        //   },
        // ],
        list: {
          itemType: 'icl',
          items: [
            {
              type: 'icl',
              props: {
                title: '130,969,671',
                alt: 'Affected people',
                data: '',
                icon: 'People16',
              },
            },
            {
              type: 'icl',
              props: {
                title: '10,032 km²',
                alt: 'Settled area',
                icon: 'Area16',
              },
            },
            {
              type: 'icl',
              props: {
                title: '3%',
                alt: 'Osm Gaps',
                icon: 'OsmGaps16',
              },
            },
          ],
        },
      },
      {
        text: 'On 17/11/2024, a flood started in Indonesia, lasting until 12/02/2025 (last update). The flood caused 37 deaths and 4190 displaced .',
      },
      {
        // actions: [ // Invalid - remove shorthand array
        //   {
        //     title: 'gdacs.org',
        //     type: 'external_link',
        //     data: 'https://www.gdacs.org/report.aspx?eventtype=FL&eventid=1103025',
        //   },
        //   {
        //     title: 'gdacs.org',
        //     type: 'external_link',
        //     data: 'https://www.gdacs.org/report.aspx?eventid=1103025&episodeid=44&eventtype=FL',
        //   },
        // ],
        list: {
          itemType: 'actions',
          items: [
            {
              type: 'actions',
              props: {
                title: 'gdacs.org',
                type: 'external_link',
                data: 'https://www.gdacs.org/report.aspx?eventtype=FL&eventid=1103025',
              },
            },
            {
              type: 'actions',
              props: {
                title: 'gdacs.org',
                type: 'external_link',
                data: 'https://www.gdacs.org/report.aspx?eventid=1103025&episodeid=44&eventtype=FL',
              },
            },
          ],
        },
      },
      {
        text: 'Started Nov 17, 2024, 4:00 AM GMT+3',
      },
      {
        text: 'Updated Feb 11, 2025, 6:46 PM GMT+3',
      },
    ],
  };
  return c;
}

```

**Key Advantages of This Approach**

-   **Centralized List Logic:** `ListContainer` handles the common logic for all lists.
-   **Reduced Code Duplication:**  The container components become much simpler.
-   **Improved Scalability:** Adding new list types is easier.
-   **Enhanced Consistency:** Styling and behavior are consistent across lists.
-   **Greater Flexibility:**  It's easier to compose elements within lists.
-   **Type Safety:** The use of generics and types ensures type safety throughout the system.

This refactoring provides a more robust, maintainable, and scalable solution for managing list-like elements within your `Uni` components. It adheres to best practices for UI/UX architecture by separating concerns and promoting reusability.

# Proposal re-evaluation

A.1> Core Issues in Current Implementation:
1. Mixed responsibilities in container components
2. Inconsistent handling of arrays vs single items
3. Complex normalization logic in UniCard
4. Redundant styling patterns across components

A.2> Valuable Aspects of the Proposal:
1. Separation of container/item concerns
2. Type-safe composition
3. Centralized list handling
4. Consistent styling patterns

A.3> Suggested Improvements to the Proposal:

C.3.1> Simplified Type System:
```typescript:src/components/Uni/Elements/types.ts
// Base types for all Uni elements
type BaseUniItem<T = unknown> = {
  value: T;
  className?: string;
  style?: React.CSSProperties;
};

// List container configuration
type ListConfig<T extends UniElementId> = {
  items: Array<BaseUniItem<ElementValueType<T>>>;
  layout?: 'row' | 'column';
  gap?: 'small' | 'medium' | 'large';
};

// Unified item type
export type UniCardItem =
  | { [K in UniElementId]: BaseUniItem<ElementValueType<K>> }
  | { list: ListConfig<UniElementId> };
```

C.3.2> Enhanced ListContainer with Layout Options:
```typescript:src/components/Uni/Elements/ListContainer.tsx
type ListContainerProps<T> = {
  items: T[];
  layout?: 'row' | 'column';
  gap?: 'small' | 'medium' | 'large';
  itemComponent: React.ComponentType<{ item: T }>;
};

export function ListContainer<T>({
  items,
  layout = 'row',
  gap = 'medium',
  itemComponent: ItemComponent,
}: ListContainerProps<T>) {
  return (
    <div className={clsx(s.container, s[layout], s[`gap-${gap}`])}>
      {items.map((item, index) => (
        <ItemComponent key={index} item={item} />
      ))}
    </div>
  );
}
```

C.3.3> Simplified Normalization in UniCard:
```typescript:src/components/Uni/UniCard.tsx
function normalizeItem(item: UniCardItem): NormalizedUniItem {
  const [type, value] = Object.entries(item)[0];

  // Handle list type specially
  if (type === 'list') {
    return {
      type,
      props: value as ListConfig<UniElementId>
    };
  }

  // Handle regular items
  return {
    type,
    props: typeof value === 'string' ? { value } : value
  };
}
```

A.4> Additional Recommendations:

1. **CSS Module Organization**:
```typescript:src/components/Uni/Elements/styles.ts
export const spacing = {
  small: 'var(--half-unit)',
  medium: 'var(--unit)',
  large: 'var(--double-unit)'
} as const;

export const layouts = {
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  }
} as const;
```

2. **Error Boundaries**:
```typescript:src/components/Uni/Elements/ErrorBoundary.tsx
export function UniElementErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<div className={s.error}>Failed to render element</div>}
    >
      {children}
    </ErrorBoundary>
  );
}
```

3. **Performance Optimization**:
```typescript:src/components/Uni/Elements/ListContainer.tsx
const MemoizedItem = memo(({ item, Component }: {
  item: UniCardItem;
  Component: React.ComponentType<any>;
}) => (
  <Component {...item.props} />
));
```

A.5> Migration Strategy:

1. Create new container/item components alongside existing ones
2. Gradually migrate each element type to new pattern
3. Update tests and fixtures incrementally
4. Remove old implementations once migration is complete

A.6> Key Benefits of These Improvements:

1. More predictable type system
2. Simplified normalization logic
3. Better runtime performance
4. More flexible styling system
5. Easier testing and maintenance
6. Clearer migration path
