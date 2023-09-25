       /config/appconfig.json ->

url -> /apps/configuration -> getDefaultLayers -> getBasemapFromDetails -> getLayersDetails -> updateAppConfigOverrides
-> setAppLanguage

```ts
// globalThis.konturAppConfig
fetch(`${import.meta.env?.BASE_URL}config/appconfig.json`);

// +

const appConfigResponse = await apiClient.get<AppDto>(
  '/apps/configuration',
  { appId: initialState.app },
  true,
);
```

```ts

```
