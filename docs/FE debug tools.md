# FE debug tools

### Reatom store changes logging

Activated via localstorage:

simple log actions

localStorage.setItem('KONTUR_DEBUG', 'true')

simple log actions via **warn** (provides stacktrace )

localStorage.setItem('KONTUR_WARN', 'true')
* trace** specific action, that includes provided string in name

localStorage.setItem('KONTUR_TRACE_ERROR', '_error')

Most useful: dump store patch calls with extended info (causes etc) and stacktrace (**warn**), it's noisy

localStorage.setItem('KONTUR_TRACE_PATCH', 'true')

log metrics-specific stuff:

localStorage.setItem('KONTUR_METRICS_DEBUG', 'true')

### React render tracker

See setup and usage <https://github.com/lahmatiy/react-render-tracker#option-1--using-with-browsers-devtools>

Required chrome extensions: React Devtools, Rempl

Activated in vite env file with VITE_DEBUG_RENDER_TRACKER=true

### .env files flags 

```
VITE_DEBUG_HMR=true
VITE_DEBUG_RENDER_TRACKER=true
```

To create local override ignored by git, use **.env.development.local** file, see <https://vitejs.dev/guide/env-and-mode.html#env-files>

### Feature override

Use **VITE_FEATURES_CONFIG** to override any app feature, it will be applied after loading of features during regular app init flow. It should be **one line, no linebreaks**, parsable as JSON:

```
VITE_FEATURES_CONFIG={"current_event":false, "events_list":false, "analytics_panel":false, "advanced_analytics_panel":false, "layer_features_panel":false}
```
