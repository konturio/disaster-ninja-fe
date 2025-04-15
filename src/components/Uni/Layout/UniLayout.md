# UniLayout Documentation

## 1. Architecture Overview

UniLayout is a declarative layout system for building UIs based on JSON configuration. It handles:

- Dynamic data binding via optimized path accessors
- Automatic metadata association with bound fields
- Consistent formatting of values
- Contextual data scoping for component trees
- Customizable component registries

## 2. Core Components

The system consists of four primary components:

- `LayoutProvider`: Sets up context and configuration
- `LayoutRenderer`: Transforms layout definitions into React components
- `accessorCompiler`: Optimizes data access paths
- Component, field, and format registries

## 3. Layout Definition Format

Layout definitions are nested JSON objects describing the UI structure:

```json
// Basic component with static values
{
  "type": "Text",
  "value": "Static text"
}

// Component with data binding
{
  "type": "Badge",
  "$value": "projectId",
  "$props": {
    "variant": "priority"
  },
  "overrides": {
    "value": {
      "icon": "Star16"
    }
  }
}

// Component with context and children
{
  "type": "Card",
  "$context": "event",
  "children": [
    {
      "type": "Title",
      "$value": "name"
    },
    {
      "type": "Text",
      "$value": "description"
    }
  ]
}
```

## 4. Data Binding Mechanisms

The system offers multiple binding approaches:

- `$value`: Binds data to component's value prop
- `$props`: Maps data fields to specific component properties
- `$context`: Establishes data scope for component and children
- Direct `props`: Static values that take precedence over bindings
- `overrides`: Customizes field metadata properties

## 5. Binding Resolution Process

The layout engine resolves bindings in this order:

1. Context establishment via `$context`
2. Property resolution (static props → dynamic bindings → auto-binding)
3. Metadata association for bound properties
4. Override application via shallow merging

## 6. Creating Custom Components

Components receive bound values directly as props with metadata in `$meta`:

```jsx
function CustomBadge({ value, variant = 'neutral', $meta, handleAction, ...props }) {
  // Access raw values directly as props
  // Access metadata through $meta.value or $meta.variant

  // Use formatting utility from context if needed
  const { getFormattedValue } = useLayoutContext();
  const formattedValue = getFormattedValue($meta.value, value);

  // Use handleAction for component interactions
  const handleClick = () => {
    // Current component data context is automatically included
    handleAction('badgeClicked');

    // Or with additional specific data
    handleAction('badgeSelected', { id: value.id });
  };

  return (
    <div className={`badge ${variant}`} onClick={handleClick}>
      {formattedValue}
    </div>
  );
}

// Add to component registry
const customComponentMap = {
  CustomBadge,
};
```

## 7. Field Metadata System

Field metadata provides type information and formatting instructions:

```js
{
  "affectedPopulation": {
    "type": "number",
    "format": "number",
    "tooltip": "Population affected by event",
    "icon": "People16"
  }
}
```

Field metadata properties:

- `type`: Data type (number, string, date, etc.)
- `format`: Formatting function key from formatsRegistry
- `text`: Optional transform function for formatted text
- `label`: Human-readable field label
- `tooltip`: Explanatory text for the field
- `icon`: Icon identifier to display with the field

## 8. Understanding the $meta Object

The `$meta` object is a special prop passed to components containing metadata for all bound properties. It works as follows:

### Structure and Population

1. The `$meta` object is keyed by property name, matching the props being bound:

   ```js
   {
     value: { /* metadata for value prop */ },
     variant: { /* metadata for variant prop */ },
     // other bound properties...
   }
   ```

2. For `$value` bindings:

   ```json
   {
     "type": "Badge",
     "$value": "projectId"
   }
   ```

   The system:

   - Looks up "projectId" in fieldsRegistry
   - Assigns resulting metadata to `$meta.value`
   - Component receives: `{ value: "123", $meta: { value: { type: "number", ... } } }`

3. For `$props` bindings:
   ```json
   {
     "type": "Badge",
     "$props": {
       "value": "projectId",
       "variant": "priority"
     }
   }
   ```
   The system:
   - Looks up each path in fieldsRegistry
   - Creates a $meta entry for each bound prop
   - Component receives: `{ value: "123", variant: "high", $meta: { value: {...}, variant: {...} } }`

### Overriding Metadata

The `overrides` property allows customizing metadata:

```json
{
  "type": "Badge",
  "$value": "projectId",
  "overrides": {
    "value": {
      "icon": "Star16",
      "format": "custom"
    }
  }
}
```

How overrides work:

1. The original metadata from fieldsRegistry is retrieved
2. Properties from the override object are shallow-merged with original metadata
3. The resulting merged metadata is passed to the component

Processing steps:

1. Original metadata: `{ type: "number", icon: "Dot16" }`
2. Specified overrides: `{ icon: "Star16", format: "custom" }`
3. Result in $meta: `{ type: "number", icon: "Star16", format: "custom" }`

### Complete Flow Example

Starting with this field definition:

```js
// fieldsRegistry.ts
projectId: {
  type: 'number',
  text: (v) => `#${v}`,
}
```

And this layout definition:

```json
{
  "type": "Badge",
  "$props": {
    "value": "projectId",
    "status": "status"
  },
  "overrides": {
    "value": {
      "icon": "Project16"
    }
  }
}
```

The component receives:

```js
{
  value: 42, // raw value from projectId
  status: "active", // raw value from status
  $meta: {
    value: {
      type: "number",
      text: (v) => `#${v}`,
      icon: "Project16" // overridden
    },
    status: {
      // metadata from fieldsRegistry for status
    }
  }
}
```

## 9. Value Formatting

The system formats values using registered formatters:

```js
{
  "date": (date) => dateFormatter(new Date(date)),
  "square_km": (value) => `${formatter.format(value)} km²`,
  "percentage_rounded": (value) => percentFormatter.format(value / 100),
  "currency": (value) => currencyFormatter.format(value)
}
```

Formatting process:

1. Determine format key from field metadata
2. Look up formatter in registry
3. Apply formatter to raw value
4. Apply text transformation if specified

## 10. Using the Layout Provider

Integration in React applications:

```jsx
<LayoutProvider
  layout={layoutDefinition}
  data={dataObject}
  actionHandler={handleAction}
  customComponentMap={myComponents}
  customFieldsRegistry={myFields}
  customFormatsRegistry={myFormatters}
>
  {/* Optional additional content */}
</LayoutProvider>
```

## 11. Layout Context Utilities

The `useLayoutContext` hook provides access to these utilities:

```jsx
const {
  // Access component registry
  componentMap,

  // Access field metadata registry
  fieldsRegistry,

  // Access format functions registry
  formatsRegistry,

  // Access optimized data accessors
  precompiledAccessors,

  // Handle interactive actions (e.g., clicks, form submissions)
  actionHandler,

  // Reference to the renderer for recursive rendering
  RendererComponent,

  // Utility to format values according to field metadata
  getFormattedValue,
} = useLayoutContext();
```

Usage example:

```jsx
function MyComponent({ value, $meta }) {
  const { getFormattedValue, actionHandler } = useLayoutContext();

  // Format value using field metadata
  const formattedValue = getFormattedValue($meta.value, value);

  // Handle user interaction
  const handleClick = () => {
    actionHandler('itemSelected', { id: value });
  };

  return <button onClick={handleClick}>{formattedValue}</button>;
}
```

## 12. Performance Optimizations

The system employs several optimizations:

- Pre-compiled accessor functions for all data paths
- Memoization of context values and accessors
- Component memoization to reduce unnecessary re-renders
- Efficient error handling with graceful fallbacks

## 13. Error Handling

The system provides graceful error handling through the `ErrorComponent`:

```jsx
<ErrorComponent type="ComponentName" error="Error message" severity="error|warning" />
```

Common error scenarios handled:

- Missing components in registry
- Invalid data paths
- Accessor execution errors
- Component rendering errors

## 14. Action Handling

Each component rendered by the LayoutRenderer automatically receives a `handleAction` prop:

```jsx
function MyComponent({ value, handleAction }) {
  return <button onClick={() => handleAction('buttonClicked')}>{value.name}</button>;
}
```

The `handleAction` function:

1. Takes an action name and optional additional data
2. Automatically includes the component's current data context
3. Calls the parent context's actionHandler with the action and merged data

This allows component interactions to bubble up while maintaining data context:

```jsx
// Parent component setting up the action handler
<LayoutProvider
  layout={layoutDefinition}
  data={dataObject}
  actionHandler={(action, data) => {
    // Receives both the action name and context-aware data
    console.log(action); // e.g., "buttonClicked"
    console.log(data); // Merged component data context + any additional data
  }}
>
  {/* Children components */}
</LayoutProvider>
```
