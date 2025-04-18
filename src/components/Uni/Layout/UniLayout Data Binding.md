# Uni Layout Data Binding

## Core Concepts

The Uni Layout system implements a declarative, predictable approach to data binding with these key principles:

1. **Direct Value Binding**: Raw values are passed directly to component props without wrapping objects
2. **Metadata Association**: Field metadata is automatically associated with bound properties
3. **Single-Level Overrides**: Simple customization of metadata properties through shallow merging
4. **Clear Data Context**: Explicit control over the data context for component hierarchies
5. **Static Priority**: Static values always take precedence over dynamic bindings

## Binding Mechanisms

### Data Access

- `$context`: Sets the data context for a component and its children
- `$value`: Binds a specific value to the component's `value` property
- `$props`: Maps data fields to specific component properties
- `$template`: Defines the template to use for rendering an array of data
- `props` & direct props: Static values that take precedence over auto-binding

### Metadata Handling

Metadata from the field registry is automatically:

1. Associated with bound properties based on their paths
2. Made available through the `$meta` prop object
3. Customizable via property-level `overrides`

### Conditional Rendering

- `$if`: Renders component only if the bound value is truthy

```json
{
  "type": "Notification",
  "$if": "hasAlerts",
  "$value": "alertCount"
}
```

Implementation details:

- Evaluated after context resolution
- Uses same data context as other bindings
- Falsy values: undefined, null, false, 0, "", NaN

### Template Rendering

- `$template`: Defines the template to use for rendering an array of data

```json
{
  "$value": "items",
  "$template": {
    "type": "Badge",
    "$value": "name",
    "variant": "primary"
  }
}
```

Implementation details:

- The `$value` property must reference an array
- Each array item becomes the data context for one template rendering
- Template rendering is performed directly by the LayoutRenderer
- Templates can be nested for complex data structures

## Binding Resolution Process

The layout engine processes bindings in this order:

1. **Context Resolution**: `$context` establishes the data scope for a component tree
2. **Template Check**: If a node has `$template` and an array `value`, the template rendering process is used
3. **Property Resolution**:
   - Static props from `props` object or direct component properties
   - Dynamic bindings from `$value` and `$props`
   - Automatic binding of context data (only if no static values exist)
4. **Metadata Association**: Each bound property receives associated metadata
5. **Override Application**: Property-specific overrides are applied with shallow merging

## Examples

### Static Values

Static values can be provided directly in the component definition:

```javascript
{
  "type": "Title",
  "value": "Static Title"
}
```

Or through the `props` property:

```javascript
{
  "type": "Title",
  "props": {
    "value": "Static Title"
  }
}
```

Both approaches result in:

- `value`: "Static Title"
- `$meta`: {} (empty object since no binding)

### Simple Data Binding

The `$value` binding binds a data field to the component's `value` prop:

```javascript
{
  "type": "Text",
  "$value": "eventName"
}
```

This component receives:

- `value`: The raw value from `eventName` field
- `$meta`: { value: [metadata for eventName] }

### Property Binding

For components that need multiple bound properties:

```javascript
{
  "type": "Badge",
  "$props": {
    "value": "projectId",
    "variant": "priority"
  }
}
```

The `Badge` component receives:

- `value`: The raw value of `projectId`
- `variant`: The raw value of `priority`
- `$meta`: { value: [metadata for projectId], variant: [metadata for priority] }

### Data Context

The `$context` binding establishes a new data scope:

```javascript
{
  "type": "Card",
  "$context": "event",
  "children": [
    {
      "type": "Title",
      "$value": "name"  // Resolves to event.name
    },
    {
      "type": "Text",
      "$value": "location"  // Resolves to event.location
    }
  ]
}
```

All bindings in child components are resolved relative to the `event` object.

### Auto-Binding

When a component has a `$context` but no explicit `$value` binding:

```javascript
{
  "type": "Text",
  "$context": "user"
}
```

If `user` resolves to a primitive value, it will automatically bind to the `value` prop.

To prevent auto-binding, explicitly set `$value` to `null`:

```javascript
{
  "type": "Card",
  "$context": "data",
  "$value": null,
  "children": [...]
}
```

### Using Metadata Overrides

The `overrides` mechanism allows customizing field metadata:

```javascript
{
  "type": "Badge",
  "$props": {
    "value": "projectId"
  },
  "overrides": {
    "value": {
      "format": "custom",
      "icon": "Star16"
    }
  }
}
```

This preserves the base metadata for `projectId` while overriding specific properties.

### Template Rendering Example

For rendering collections of data:

```javascript
{
  "type": "Card",
  "children": [
    {
      "type": "Title",
      "value": "Country List"
    },
    {
      "$value": "countries",
      "$template": {
        "type": "Row",
        "children": [
          {
            "type": "Text",
            "$value": "name"
          },
          {
            "type": "Badge",
            "$value": "status"
          }
        ]
      }
    }
  ]
}
```

With this structure, each item in the `countries` array will be rendered as a Row with Text and Badge components.

## Implementation Details

### Accessor Compilation

For performance optimization, the system precompiles accessor functions for all data paths during initialization.

### Component Resolution

Components are resolved from the component registry by their `type` property.

### Error Handling

The system provides graceful error handling for:

- Missing component types
- Invalid data paths
- Accessor execution errors
- Component rendering errors

## Component Implementation

Components receive bound values directly as props, with metadata in the `$meta` prop:

```javascript
function Badge({ value, variant = 'neutral', $meta, ...props }) {
  // Access raw values directly
  // Access metadata through $meta.value or $meta.variant

  // Use formatting utility from context if needed
  const { getFormattedValue } = useLayoutContext();
  const formattedValue = getFormattedValue($meta.value, value);

  return <div className={`badge ${variant}`}>{formattedValue}</div>;
}
```
