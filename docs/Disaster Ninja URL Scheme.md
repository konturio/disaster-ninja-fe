# Disaster Ninja URL Scheme

For store disaster ninja parameters in url we use **query string** instead of fragment, because  we want process that link in back-end side too, for preview image generator for example.

![image.png](https://kontur.fibery.io/api/files/6058355d-8f7e-482b-903a-ba3844819c4f#width=519&height=229 "")

## Syntax

Syntax of query described in [RFC3986 (Uniform Resource Identifier (URI): Generic Syntax)](https://datatracker.ietf.org/doc/html/rfc3986 "https://datatracker.ietf.org/doc/html/rfc3986")

## Parameters

Must be encoded in 

### Map

Describe map view state

`map={zoom}/{lon}/{lat}`

Where `{zoom}` is number with `3` digits after the decimal point,

`{lon}` and `{lat}` is numbers with `3` or more digits after the decimal point using dynamic precision as per [[Tasks/Task: Fix rounding of coordinates in URL to dynamic precision#^7b708802-3c0b-11e9-9428-04d77e8d50cb/edb99a00-6be5-11ed-bd4e-0f57d149f66d]]

### App ID

Describe what app should be loaded

(for embedded maps)

`app={uuid}`

Where `{uuid}` is some uuid

### Event ID

Describe event that should be loaded if available in feed.

`event={uuid}`\
Where `{uuid}` is some uuid

### Event Feed

Describe event feed that should be used for get event

`feed={feed_id}`

Where `{uuid}` is string

### Layers

Describe layers that should be enabled if available

`layers={layer_id_1},{layer_id_2}`

`layers={layer_id_1}`
* every id separated with not escaped `,` symbol
* if only one id - `,` should be omited
* every id must be escaped
* symbol `+` will be parsed as space symbol

### Unknown parameters

Tracking systems can add third party parameters in the end of query

We must ignore it when url parsed. We also can omit them when upgrading query string 

### Parameters Order

Parameters must be recorded on next order:

1. map
2. app
3. event
4. feed
5. layers
6. unknown

But parsed in any order


