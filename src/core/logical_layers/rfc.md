# Layer types

Before answering the question what logical layers are, we should at first consider what kind of layers we have in the context of a map.

## Map Style Layers

The [Style Specification](https://maplibre.org/maplibre-gl-js-docs/style-spec/) defines a map layer as a way of representing data.
Such layer is part of the map style and can be of type "fill", "line", "symbol", "circle" and so on.
In the context of our application, we refer to such layers as `map style layers`, or just a `style layer`

## Sources of layers

Every style layer "colorize" some data. We called this data - `layer-source`
We can identify "vector", "raster" and "geojson" layer sources.
Few layer styles can use same layer source, but not vice-versa. Keep in mind that type of layer source affects what we do or not with layer style or logical layer
For example - only geojson source can be downloaded, or - most layer style properties cannot be applied to a layer with a raster source.

Note: It's easy to confuse `layer source` and `source layer`. Source layer it's layers inside vector layer source. Simply put, source layers is something like layers inside a svg file, each of which contains its own geometry

## Logical layers

Finally - the `logical layer` is a concatenation of several data and style layers linked together by a common theme.

This is how these layers nested:

- logical layer
  - style layers
  - layer source
    - source layer

For the user of an application, the logical layer is the layer he interacts with.
For example, the logical layer "active contributors" looks like this:

- logical layers:
  - activeContributors:
    - layer styles (legend + GenericRenderer):
      - in-area-layer-activeContributors-0 (not locals names)
      - in-area-layer-activeContributors-1 (locals names)
      - in-area-layer-activeContributors-2 (hexes)
    - layers source:
      - in-area-layer-activeContributors:
        - source layers:
          - hexagon
          - users

# Structure of a logical layer

Each logical layer has additional data not related to the map, but necessary for other parts of the interface interacting with it.

The logical layer interface can be found in the file [types/logicalLayers.ts](types/logicalLayer.ts).
You can notice it's properties can be seen as two semantic parts: data and states.
The internal logic of the logical layer is described in [utils/logicalLayerFabric.ts](utils/logicalLayerFabric.ts)

## Layers registry

Depending on the application's task, you need to track changes in _all_ states of _one_ layer, or _specific_ state of _all_ layers. For example, an item in the Layer List tracks all changes in its layer, while a legend panel tracks changes in the legends of all layers.

For this reason, states are stored in separate lists (layersMeta, layersLegends, layersMenus, enabledLayers, mountedLayers, etc.) from which each layer selects the state relevant to it.

`layersRegistry` is a special list, that contains all the logical layers and knows how to create and delete them.
It is important to note that you do not need to add a logical layer to it, this should be done only if you want to allow the user to manage this layer in a standard way through the panel with the layers

### isEnabled and isMounted

The `isEnabled` and `isMounted` states deserves special mention. The layer gets `isEnabled` state if we want to show the layer to the user. Its main purpose is to _remember the choices made by the user_.
The moment we managed to get all the necessary data and layer can be showed on the map - layer calls the hook `willMount` from its renderer and becomes `isMounted`

For example - if user enables logical layer "X", then limits the search area out of layer's scope - the layer will disappear from the list of available layers, and it will be removed from the map.
However, as soon as the conditions change and we have enough data to display the layer - the layer will appear in the list and on the map again, without secondary "enable" action from the user

This mechanism is described inside logical layer atom [utils/logicalLayerFabric.ts](utils/logicalLayerFabric.ts#L189)

### Style and Legend

The layer has `legend` property. The legend gives user a hint about how the data is labeled on the map. However - we also use _the same data_ to generate style layers, which allows us to have single source of truth

## Layers hierarchy

layersHierarchy contains a list of layers having only properties that are needed to build the tree and define the position of the layer in the hierarchy

## Layers renderers

Every logical layer must be rendered on the map sooner or later.
Layer renderer is a class that describes how to do this. By default [GenericRenderer](renderers/GenericRenderer.ts) is used, but in case it is not suitable - another renderer can be defined for the layer, which implements [Renderer](renderers/DefaultRenderer.ts) interface, the essence of which is to describe the map reaction to various events of the logical layer life cycle
