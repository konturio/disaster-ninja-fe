## Initialization

We have two sources of data:

urlState: (Data in url)

- Previously enabled layers
- Map position
- etc.

defaultSettings: (Default user settings)

- Layers that we want enable by default
- etc.

Url state have **hider** priority:

```
initialState = urlState ?? defaultState
```

Now we must update url, because if not -
next time default layers will be ignored

```
urlState.update(initialState)
```

## Applying changes in data

Now we have set of layers id's that must be enabled in app.  
Let's give name for them `enabledLayers`

```
enabledLayers.set(initialState)
```

> `enabledLayers` not the same as `mountedLayers`!
> What the difference?  
> `mountedLayers` - layers that actually was mounted on the map.  
> `enabledLayers` - layers that we want mount on the map.  
> When layer id included in available layers list, and in `enabledLayers` - layer have mounted state
> (if data for him loaded successfully).

Initially we not have info about that layers available or not.  
We must try to enable initial store layers on every update of available layers.

```
onChange(
  'availableLayers',
  (availableLayers) => enabledLayers.forEach(id => {

    // Mount
    const layerThatMustBeEnabled = availableLayers[id];
    if (layerThatMustBeEnabled !== undefined) {
      if (!layerThatMustBeEnabled.isMounted) {
        layerThatMustBeEnabled.mount()
      }
    }

    // Unmount
    mountedLayers.forEach(id => {
      if (!layerThatMustBeEnabled.includes(id)) {
        mountedLayers[id].unmount()
      }
    })

  })
)
```

## Applying changes from user interactions

User can _disable_ or _enable_ layer
He can do it **directly** by clicking in layers panel,
or **indirectly**, in case of radio groups.

Usually it performs `mount` or `unmount` action in layer.
But those actions can be called without user - for example,
in the case when user did not disable layer, but we unmount it,
because it unavailable anymore.

So we have next pipelines:
layer disabled
-> layer removed from url
-> layer unmounted

layer enabled
-> layer added to url
-> layer mounted

(If loading of layer was failed, user intent to enable this layer must be stored)

enabled layer not available anymore
-> layer unmounted

enabled layer now available
-> layer mounted

## Limitations

- Previously enabled layer cannot be removed when it not available anymore.  
  Because user can't click to this layer
- When user re-login we probably must pure current url and re-init orl store
