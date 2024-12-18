## Feature config overrides

You can override feature configurations for local development.
Just create `public/config/features.local.json` file with array of feature overrides, e.g.:

```json
[
  {
    "name": "events_list",
    "description": "Events list",
    "type": "UI_PANEL",
    "configuration": {}
  }
]
```

(make sure `public/config/features.local.json` stays in gitignore)
