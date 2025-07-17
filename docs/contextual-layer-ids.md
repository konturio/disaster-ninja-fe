# Contextual Layer IDs

Some layers depend on additional context like the selected event. To avoid ID collisions these layers now include the context identifier in their `id` value.

The delimiter `__ctx__` separates the original layer id and the context id:

```
<layerId>__ctx__<contextId>
```

For example, an event shape layer with id `eventShape` belonging to event `56e8c85a-10e6-44f5-9cf0-51c6016a3e87` becomes:

```
eventShape__ctx__56e8c85a-10e6-44f5-9cf0-51c6016a3e87
```

Utility functions `applyContextToId` and `splitContextFromId` help working with these ids.
