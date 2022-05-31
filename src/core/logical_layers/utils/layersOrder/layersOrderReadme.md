## How it works

Map api allows you to either put new layer on top of layer stack or mount underneath\before specified layer
We decided to group layers by their type
LayersOrderManager provides you `beforeId` argument to add layer to it's group determined by it's type:

- to it's types bottom
- to it's types top
- if type's not yet presented(mounted) on the map - next to presented types according to specified types order

Types order stored in `layerTypesOrdered` array
(B.t.w. we also rely on `layerTypesOrdered` to set layers tooltip click listeners accordingly)

## How to use

Instance of `layersOrderManager` must be called with .init(map) method, that would give class access to map.
After initialization you can use methods `.getIdToMountOnTypesBottom()` and `.getIdToMountOnTypesTop()`.
They accept 2 arguments, first - type of the layer to be mounted,
second - a callback, that provides `beforeId` argument that you need to use when adding layers

```ts
layersOrderManager.getIdToMountOnTypesTop('line', (beforeId) => {
  map.addLayer(layer, beforeId);
});
```
