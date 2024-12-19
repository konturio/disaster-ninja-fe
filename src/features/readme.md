## Feature config overrides

You can override feature configurations for local development.
Just create `public/config/features.local.json` (make sure it stays in gitignore!) file with array of feature overrides, e.g.:

```json
{
  "map_ruler": 0,
  "mcda": 1,
  "events_list": {
    "initialSort": {
      "order": "desc"
    }
  }
}
```

- Setting a falsy value (`0`, `null`, etc) to a property turns off the feature.
- Setting a truthy value (e.g. `1`, `true` etc) turns on the feature.
- Setting an object turns the feature and sets its configuration.
