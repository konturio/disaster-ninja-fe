## Layer in area

This feature manage all layers that intersecting area of interest (a.k.a focused geometry).
Every time when geometry changes - this feature:

- generates and sends requests to the api
- saves responses to a special cache
- creates new logical layers if needed
- deletes the irrelevant layers if any

Despite the name, this feature is also responsible for:

- global (world-wide) layers
- layers related to event

### How to use

You just need activate this feature. After that all the layers will be loaded and kept up to date

```ts
if (featureFlags[FeatureFlag.LAYERS_IN_AREA]) {
  import('~features/layers_in_area').then(({ initLayersInArea }) => initLayersInArea());
}
```

### How it works

`layersGlobalResource` - load all world wide available layers.
`layersInAreaAndEventLayerResource` - load event related and focused geometry related layers

They load only info about what layers available, but not layers itself.

When info about available layers loaded - `areaLayersControlsAtom` creates logical layers for each,
so after that user or other features can enable or disable those layers.

`areaLayersDetailsResource` - load data for **enabled** layers from above resources,
that required to show layers legend, draw them on map, and so on.
