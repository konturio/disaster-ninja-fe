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

## Methods description

`.getIdToMountOnTypesBottom()` - gives an id to mount layer on the bottom of it's group. All layers on top will overlap this layer

`.getIdToMountOnTypesTop()` - gives an id to mount layer on top of it's group. This layer will overlap all layers underneath it

Explanation:

```ts
console.log(map.getStyle().layers); // Let's say we had following layers mounted:
// [
//   {type: 'background', id: 'background-layer'},
//   {type: 'fill', id: 'fill-layer-1'},
//   {type: 'fill', id: 'fill-layer-2'},
//   {type: 'fill', id: 'fill-layer-3'},
//   {type: 'custom', id: 'custom-layer-1'},
// ]

// Now using getIdToMountOnTypesBottom() we'll add this layer to the bottom of it's type

layersOrderManager.getIdToMountOnTypesBottom('fill', (beforeId) => {
  map.addLayer({ type: 'fill', id: 'fill-layer-BOTTOM' }, beforeId);
});

console.log(map.getStyle().layers); // mounted layers will be following:
// [
//   {type: 'background', id: 'background-layer'},
//   {type: 'fill', id: 'fill-layer-BOTTOM'},
//   {type: 'fill', id: 'fill-layer-1'},
//   {type: 'fill', id: 'fill-layer-2'},
//   {type: 'fill', id: 'fill-layer-3'},
//   {type: 'custom', id: 'custom-layer-1'},
// ]

// Now let's add layer to the top of the fill layers group using getIdToMountOnTypesTop()
layersOrderManager.getIdToMountOnTypesTop('fill', (beforeId) => {
  map.addLayer({ type: 'fill', id: 'fill-layer-TOP' }, beforeId);
});

console.log(map.getStyle().layers); // mounted layers are:
// [
//   {type: 'background', id: 'background-layer'},
//   {type: 'fill', id: 'fill-layer-BOTTOM'},
//   {type: 'fill', id: 'fill-layer-1'},
//   {type: 'fill', id: 'fill-layer-2'},
//   {type: 'fill', id: 'fill-layer-3'},
//   {type: 'fill', id: 'fill-layer-TOP'},
//   {type: 'custom', id: 'custom-layer-1'},
// ]
```
