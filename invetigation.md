defaultAppLayersAtom:
```
{
  "loading": false,
  "data": null,
  "error": null,
  "lastParams": null,
  "dirty": true
}
---
{
  "loading": true,
  "data": null,
  "error": null,
  "lastParams": null,
  "dirty": false
}
---
{
  loading: false,
  data: null,
  error: "Abort error",
  lastParams: null,
  dirty: false
}
```
Why it aborted?
- By next request?
  - where second response?
  - fetcher called only once with null (BUG! it's null event when we have app id in url)
    - second request call abort previous but not create new one
    - fetcher return null instantly because param is null






Cycle after HRM

GET
	https://test-apps-ninja02.konturlabs.com/active/api/events/?feed=kontur-public