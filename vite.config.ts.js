var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// configs/proxy-config.default.js
var proxy_config_default_exports = {};
__export(proxy_config_default_exports, {
  default: () => proxy_config_default_default
});
var proxy_config_default_default;
var init_proxy_config_default = __esm({
  "configs/proxy-config.default.js"() {
    "use strict";
    proxy_config_default_default = {
      ["/api/tiles/bivariate"]: {
        target: "https://disaster.ninja/active",
        changeOrigin: true
      },
      "/tiles/stats": "https://disaster.ninja",
      "/tiles/users": "https://disaster.ninja",
      "/tiles/public.hot_projects": "https://disaster.ninja"
    };
  }
});

// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

// scripts/build-info-plugin.ts
import { execSync as exec } from "child_process";
var dataSources = {
  GIT_BRANCH: () => exec("git rev-parse --abbrev-ref HEAD").toString().trim(),
  GIT_COMMIT_HASH: () => exec("git show -s --format=%h").toString().trim(),
  GIT_COMMIT_FULLHASH: () => exec("git show -s --format=%H").toString().trim(),
  GIT_COMMIT_TIME: () => exec("git show -s --format=%cI").toString().trim(),
  PACKAGE_VERSION: () => process.env.npm_package_version,
  BUILD_TIME: () => new Date().toISOString()
};
var envInjectionFailed = false;
var createPlugin = () => {
  return {
    name: "vite-plugin-build-info",
    config: (_, env) => {
      if (env) {
        const variables = Object.entries(dataSources).reduce((acc, [key, getter]) => {
          try {
            acc[`import.meta.env.${key}`] = JSON.stringify(getter());
          } catch (e) {
            console.error(e);
          }
          return acc;
        }, {});
        return { define: variables };
      } else {
        envInjectionFailed = true;
      }
    },
    configResolved(config) {
      if (envInjectionFailed) {
        config.logger.warn(`[vite-plugin-build-info] Variables was not injected due to incompatible vite version (requires vite@^2.0.0-beta.69).`);
      }
    }
  };
};
var build_info_plugin_default = createPlugin;

// scripts/select-config.mjs
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import process2 from "process";
var relativePath = (path2) => resolve(dirname(fileURLToPath(import.meta.url)), path2);
function useConfig(pathToConfig, dest) {
  const publicFolder = relativePath("../public/config");
  const pathToDest = dest ?? resolve(publicFolder, "appconfig.json");
  if (!existsSync(dirname(pathToDest))) {
    mkdirSync(dirname(pathToDest), { recursive: true });
  }
  copyFileSync(pathToConfig, pathToDest);
  console.log(`Config "${pathToConfig}" will be used`);
  return JSON.parse(readFileSync(pathToDest));
}
function selectConfig(mode) {
  const configsFolder = relativePath("../configs");
  const knownConfigs = {
    local: resolve(configsFolder, "config.local.json"),
    default: resolve(configsFolder, "config.default.json")
  };
  const isProduction = mode === "production";
  if (isProduction) {
    return knownConfigs.default;
  }
  const isHaveLocalOverride = existsSync(knownConfigs.local);
  return isHaveLocalOverride ? knownConfigs.local : knownConfigs.default;
}
if (process2.argv[1] === fileURLToPath(import.meta.url)) {
  process2.stdout.write(selectRuntimeConfig(process2.env.NODE_ENV ?? "development", process2.env, true) + "\n");
}

// scripts/build-config-scheme.mjs
import Ajv from "ajv";
import tsj from "ts-json-schema-generator";
function buildScheme() {
  const config = {
    path: "src/core/app_config/index.ts",
    tsconfig: "./tsconfig.json",
    type: "AppConfig",
    skipTypeCheck: true
  };
  const schema = tsj.createGenerator(config).createSchema(config.type);
  return schema;
}
function validateConfig(config, schema) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, config);
  if (!valid) {
    console.error(ajv.errors);
    throw Error("Configuration is not valid");
  }
}

// postcss.config.ts
import autoprefixer from "autoprefixer";
import postcssNormalize from "postcss-normalize";
import postcssNested from "postcss-nested";
import postcssCustomMedia from "postcss-custom-media";
var postcss_config_default = {
  plugins: [
    postcssCustomMedia({
      importFrom: "./node_modules/@konturio/default-theme/variables.css"
    }),
    autoprefixer,
    postcssNormalize,
    postcssNested
  ]
};

// vite.proxy.ts
async function getLocalConfig() {
  try {
    const res = await import("./configs/proxy-config.local");
    console.log("Applying local vite proxy config file from ./configs/proxy-config.local.js");
    return res.default;
  } catch (e) {
    try {
      const res = await Promise.resolve().then(() => (init_proxy_config_default(), proxy_config_default_exports));
      console.log("Applying local vite proxy config file from ./configs/proxy-config.default.js");
      return res.default;
    } catch (e2) {
      console.log("Not found any proxy configs");
      return {};
    }
  }
}
var proxyConfig = await getLocalConfig();

// vite.config.ts
var relative = (folder) => path.resolve("C:\\code\\kontur\\disaster-ninja-fe", folder);
var parseEnv = (env) => Object.entries(env).reduce((acc, [k, v]) => {
  try {
    acc[k] = JSON.parse(v);
  } catch (e) {
  }
  return acc;
}, env);
var vite_config_default = ({ mode }) => {
  const env = parseEnv(loadEnv(mode, process.cwd()));
  const config = useConfig(selectConfig(mode), env.DEST_PATH);
  validateConfig(config, buildScheme());
  return defineConfig({
    base: `${env.VITE_BASE_PATH}${env.VITE_STATIC_PATH}`,
    build: {
      minify: mode !== "development",
      sourcemap: true,
      rollupOptions: {
        plugins: [!!env.VITE_ANALYZE_BUNDLE && visualizer({ open: true })]
      }
    },
    plugins: [
      react(),
      mode === "production" && build_info_plugin_default(),
      createHtmlPlugin({
        inject: {
          data: {
            ...env,
            mode
          }
        }
      })
    ],
    optimizeDeps: {
      include: ["react/jsx-runtime"]
    },
    css: {
      postcss: postcss_config_default
    },
    esbuild: {
      jsxInject: 'import { createElement, Fragment } from "react"',
      jsxFactory: "createElement",
      jsxFragment: "Fragment"
    },
    resolve: {
      alias: {
        "~components": relative("./src/components"),
        "~views": relative("./src/views"),
        "~config": relative("./src/config"),
        "~utils": relative("./src/utils"),
        "~services": relative("./src/services"),
        "~appModule": relative("./src/redux-modules/appModule"),
        "~core": relative("./src/core"),
        "~features": relative("./src/features")
      }
    },
    server: {
      proxy: proxyConfig,
      port: 3e3
    },
    define: mode === "development" ? {
      viteProxyConfig: JSON.stringify(proxyConfig)
    } : void 0
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29uZmlncy9wcm94eS1jb25maWcuZGVmYXVsdC5qcyIsICJ2aXRlLmNvbmZpZy50cyIsICJzY3JpcHRzL2J1aWxkLWluZm8tcGx1Z2luLnRzIiwgInNjcmlwdHMvc2VsZWN0LWNvbmZpZy5tanMiLCAic2NyaXB0cy9idWlsZC1jb25maWctc2NoZW1lLm1qcyIsICJwb3N0Y3NzLmNvbmZpZy50cyIsICJ2aXRlLnByb3h5LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgZGVmYXVsdCB7XG4gIC8qIEJpdmFyaWF0ZSBsYXllcnMgKi9cbiAgWycvYXBpL3RpbGVzL2JpdmFyaWF0ZSddOiB7XG4gICAgdGFyZ2V0OiAnaHR0cHM6Ly9kaXNhc3Rlci5uaW5qYS9hY3RpdmUnLFxuICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgfSxcbiAgLyogRm9yIGJpdmFyaWF0ZSBtYW5hZ2VyICovXG4gICcvdGlsZXMvc3RhdHMnOiAnaHR0cHM6Ly9kaXNhc3Rlci5uaW5qYScsXG4gIC8qIEZvciBBY3RpdmUgY29udHJpYnV0b3JzICAqL1xuICAnL3RpbGVzL3VzZXJzJzogJ2h0dHBzOi8vZGlzYXN0ZXIubmluamEnLFxuICAvKiBIb3QgYWN0aXZhdGlvbnMgKi9cbiAgJy90aWxlcy9wdWJsaWMuaG90X3Byb2plY3RzJzogJ2h0dHBzOi8vZGlzYXN0ZXIubmluamEnLFxufTtcbiIsICJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnO1xuaW1wb3J0IHZpdGVCdWlsZEluZm9QbHVnaW4gZnJvbSAnLi9zY3JpcHRzL2J1aWxkLWluZm8tcGx1Z2luJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCB7IHNlbGVjdENvbmZpZywgdXNlQ29uZmlnIH0gZnJvbSAnLi9zY3JpcHRzL3NlbGVjdC1jb25maWcubWpzJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCB7IGJ1aWxkU2NoZW1lLCB2YWxpZGF0ZUNvbmZpZyB9IGZyb20gJy4vc2NyaXB0cy9idWlsZC1jb25maWctc2NoZW1lLm1qcyc7XG5cbmltcG9ydCBwb3N0Y3NzQ29uZmlnIGZyb20gJy4vcG9zdGNzcy5jb25maWcnO1xuaW1wb3J0IHsgcHJveHlDb25maWcgfSBmcm9tICcuL3ZpdGUucHJveHknO1xuXG5jb25zdCByZWxhdGl2ZSA9IChmb2xkZXI6IHN0cmluZykgPT4gcGF0aC5yZXNvbHZlKFwiQzpcXFxcY29kZVxcXFxrb250dXJcXFxcZGlzYXN0ZXItbmluamEtZmVcIiwgZm9sZGVyKTtcbmNvbnN0IHBhcnNlRW52ID0gKGVudjogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT5cbiAgT2JqZWN0LmVudHJpZXMoZW52KS5yZWR1Y2UoKGFjYywgW2ssIHZdKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGFjY1trXSA9IEpTT04ucGFyc2Uodik7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gYWNjO1xuICB9LCBlbnYpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IHBhcnNlRW52KGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSkpO1xuICBjb25zdCBjb25maWcgPSB1c2VDb25maWcoc2VsZWN0Q29uZmlnKG1vZGUpLCBlbnYuREVTVF9QQVRIKTtcbiAgdmFsaWRhdGVDb25maWcoY29uZmlnLCBidWlsZFNjaGVtZSgpKTtcbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XG4gICAgYmFzZTogYCR7ZW52LlZJVEVfQkFTRV9QQVRIfSR7ZW52LlZJVEVfU1RBVElDX1BBVEh9YCxcbiAgICBidWlsZDoge1xuICAgICAgbWluaWZ5OiBtb2RlICE9PSAnZGV2ZWxvcG1lbnQnLFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBwbHVnaW5zOiBbISFlbnYuVklURV9BTkFMWVpFX0JVTkRMRSAmJiB2aXN1YWxpemVyKHsgb3BlbjogdHJ1ZSB9KV0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIG1vZGUgPT09ICdwcm9kdWN0aW9uJyAmJiB2aXRlQnVpbGRJbmZvUGx1Z2luKCksXG4gICAgICBjcmVhdGVIdG1sUGx1Z2luKHtcbiAgICAgICAgaW5qZWN0OiB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLi4uZW52LFxuICAgICAgICAgICAgbW9kZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgXSxcbiAgICAvLyB3YXMgZml4ZWQgaW4gcGx1Z2luLXJlYWN0IHRvIDMuMC4wLWFscGhhLjIuIHNvIGFmdGVyIDMuMC4wIHJlbGVhc2UgdGhpcyB3b3JrYXJvdW5kIGNhbiBiZSByZW1vdmVkXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbJ3JlYWN0L2pzeC1ydW50aW1lJ10sXG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHBvc3Rjc3NDb25maWcsXG4gICAgfSxcbiAgICBlc2J1aWxkOiB7XG4gICAgICAvLyBBdm9pZCBjb25mbGljdGluZyB3aXRoIFwiaW1wb3J0IFJlYWN0XCJcbiAgICAgIGpzeEluamVjdDogJ2ltcG9ydCB7IGNyZWF0ZUVsZW1lbnQsIEZyYWdtZW50IH0gZnJvbSBcInJlYWN0XCInLFxuICAgICAganN4RmFjdG9yeTogJ2NyZWF0ZUVsZW1lbnQnLFxuICAgICAganN4RnJhZ21lbnQ6ICdGcmFnbWVudCcsXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnfmNvbXBvbmVudHMnOiByZWxhdGl2ZSgnLi9zcmMvY29tcG9uZW50cycpLFxuICAgICAgICAnfnZpZXdzJzogcmVsYXRpdmUoJy4vc3JjL3ZpZXdzJyksXG4gICAgICAgICd+Y29uZmlnJzogcmVsYXRpdmUoJy4vc3JjL2NvbmZpZycpLFxuICAgICAgICAnfnV0aWxzJzogcmVsYXRpdmUoJy4vc3JjL3V0aWxzJyksXG4gICAgICAgICd+c2VydmljZXMnOiByZWxhdGl2ZSgnLi9zcmMvc2VydmljZXMnKSxcbiAgICAgICAgJ35hcHBNb2R1bGUnOiByZWxhdGl2ZSgnLi9zcmMvcmVkdXgtbW9kdWxlcy9hcHBNb2R1bGUnKSxcbiAgICAgICAgJ35jb3JlJzogcmVsYXRpdmUoJy4vc3JjL2NvcmUnKSxcbiAgICAgICAgJ35mZWF0dXJlcyc6IHJlbGF0aXZlKCcuL3NyYy9mZWF0dXJlcycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgcHJveHk6IHByb3h5Q29uZmlnLFxuICAgICAgcG9ydDogMzAwMCxcbiAgICB9LFxuICAgIGRlZmluZTpcbiAgICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCdcbiAgICAgICAgPyB7XG4gICAgICAgICAgICB2aXRlUHJveHlDb25maWc6IEpTT04uc3RyaW5naWZ5KHByb3h5Q29uZmlnKSxcbiAgICAgICAgICB9XG4gICAgICAgIDogdW5kZWZpbmVkLFxuICB9KTtcbn07XG4iLCAiaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGV4ZWNTeW5jIGFzIGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcblxuY29uc3QgZGF0YVNvdXJjZXMgPSB7XG4gIEdJVF9CUkFOQ0g6ICgpID0+IGV4ZWMoJ2dpdCByZXYtcGFyc2UgLS1hYmJyZXYtcmVmIEhFQUQnKS50b1N0cmluZygpLnRyaW0oKSxcbiAgR0lUX0NPTU1JVF9IQVNIOiAoKSA9PiBleGVjKCdnaXQgc2hvdyAtcyAtLWZvcm1hdD0laCcpLnRvU3RyaW5nKCkudHJpbSgpLFxuICBHSVRfQ09NTUlUX0ZVTExIQVNIOiAoKSA9PiBleGVjKCdnaXQgc2hvdyAtcyAtLWZvcm1hdD0lSCcpLnRvU3RyaW5nKCkudHJpbSgpLFxuICBHSVRfQ09NTUlUX1RJTUU6ICgpID0+IGV4ZWMoJ2dpdCBzaG93IC1zIC0tZm9ybWF0PSVjSScpLnRvU3RyaW5nKCkudHJpbSgpLFxuICAvLyBHSVRfQ09NTUlUX0FVVEhPUjogKCkgPT4gZXhlYygnZ2l0IHNob3cgLXMgLS1mb3JtYXQ9JWFuJykudG9TdHJpbmcoKS50cmltKCksXG4gIC8vIEdJVF9DT01NSVRfQ09NTUlURVI6ICgpID0+IGV4ZWMoJ2dpdCBzaG93IC1zIC0tZm9ybWF0PSVjbicpLnRvU3RyaW5nKCkudHJpbSgpLFxuICAvLyBHSVRfQ09NTUlUX01FU1NBR0U6ICgpID0+IGV4ZWMoJ2dpdCBzaG93IC1zIC0tZm9ybWF0PSViJykudG9TdHJpbmcoKS50cmltKCksXG4gIFBBQ0tBR0VfVkVSU0lPTjogKCkgPT4gcHJvY2Vzcy5lbnYubnBtX3BhY2thZ2VfdmVyc2lvbixcbiAgQlVJTERfVElNRTogKCkgPT4gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxufTtcblxubGV0IGVudkluamVjdGlvbkZhaWxlZCA9IGZhbHNlO1xuXG5jb25zdCBjcmVhdGVQbHVnaW4gPSAoKTogUGx1Z2luID0+IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZS1wbHVnaW4tYnVpbGQtaW5mbycsXG4gICAgY29uZmlnOiAoXywgZW52KSA9PiB7XG4gICAgICBpZiAoZW52KSB7XG4gICAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IE9iamVjdC5lbnRyaWVzKGRhdGFTb3VyY2VzKS5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgW2tleSwgZ2V0dGVyXSkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYWNjW2BpbXBvcnQubWV0YS5lbnYuJHtrZXl9YF0gPSBKU09OLnN0cmluZ2lmeShnZXR0ZXIoKSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgIH0sXG4gICAgICAgICAge30sXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB7IGRlZmluZTogdmFyaWFibGVzIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnZJbmplY3Rpb25GYWlsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgY29uZmlnUmVzb2x2ZWQoY29uZmlnKSB7XG4gICAgICBpZiAoZW52SW5qZWN0aW9uRmFpbGVkKSB7XG4gICAgICAgIGNvbmZpZy5sb2dnZXIud2FybihcbiAgICAgICAgICBgW3ZpdGUtcGx1Z2luLWJ1aWxkLWluZm9dIFZhcmlhYmxlcyB3YXMgbm90IGluamVjdGVkIGR1ZSBgICtcbiAgICAgICAgICAgIGB0byBpbmNvbXBhdGlibGUgdml0ZSB2ZXJzaW9uIChyZXF1aXJlcyB2aXRlQF4yLjAuMC1iZXRhLjY5KS5gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQbHVnaW47XG4iLCAiaW1wb3J0IHsgY29weUZpbGVTeW5jLCBleGlzdHNTeW5jLCBta2RpclN5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gJ25vZGU6ZnMnO1xyXG5pbXBvcnQgeyByZXNvbHZlLCBkaXJuYW1lIH0gZnJvbSAnbm9kZTpwYXRoJztcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XHJcbmltcG9ydCBwcm9jZXNzIGZyb20gJ3Byb2Nlc3MnO1xyXG5cclxuY29uc3QgcmVsYXRpdmVQYXRoID0gcGF0aCA9PiByZXNvbHZlKGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSwgcGF0aCk7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzZUNvbmZpZyhwYXRoVG9Db25maWcsIGRlc3QpIHtcclxuICAvLyBDcmVhdGUgZGlyIGZvciBjb25maWdcclxuICBjb25zdCBwdWJsaWNGb2xkZXIgPSByZWxhdGl2ZVBhdGgoJy4uL3B1YmxpYy9jb25maWcnKTtcclxuICBjb25zdCBwYXRoVG9EZXN0ID0gZGVzdCA/PyByZXNvbHZlKHB1YmxpY0ZvbGRlciwgJ2FwcGNvbmZpZy5qc29uJyk7XHJcbiAgaWYgKCFleGlzdHNTeW5jKGRpcm5hbWUocGF0aFRvRGVzdCkpKXtcclxuICAgIG1rZGlyU3luYyhkaXJuYW1lKHBhdGhUb0Rlc3QpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxuICB9XHJcblxyXG4gIC8vIFNhdmUgY29uZmlnIGZpbGVcclxuICBjb3B5RmlsZVN5bmMocGF0aFRvQ29uZmlnLCBwYXRoVG9EZXN0KTtcclxuICBjb25zb2xlLmxvZyhgQ29uZmlnIFwiJHtwYXRoVG9Db25maWd9XCIgd2lsbCBiZSB1c2VkYCk7XHJcblxyXG4gIC8vIFJldHVybiBzYXZlZCBjb25maWdcclxuICByZXR1cm4gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGF0aFRvRGVzdCkpO1xyXG59XHJcblxyXG4vKipcclxuICogVGhpcyBzY3JpcHQgc2VsZWN0IHJpZ2h0IGNvbmZpZyBkZXBlbmRpbmcgb24gZW52LlxyXG4gKiBJbiBwcm9kdWN0aW9uIG1vZGUgaW4gd2lsbCB1c2UgZGVmYXVsdCBjb25maWcsIGluIGRldmVsb3BtZW50IGl0IHByZWZlciB0byB1c2UgbG9jYWwgY29uZmlnXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0Q29uZmlnKG1vZGUpIHtcclxuICAvLyBTZXR1cCBwYXRoXHJcbiAgY29uc3QgY29uZmlnc0ZvbGRlciA9IHJlbGF0aXZlUGF0aCgnLi4vY29uZmlncycpO1xyXG4gIGNvbnN0IGtub3duQ29uZmlncyA9IHtcclxuICAgIGxvY2FsOiByZXNvbHZlKGNvbmZpZ3NGb2xkZXIsICdjb25maWcubG9jYWwuanNvbicpLFxyXG4gICAgZGVmYXVsdDogcmVzb2x2ZShjb25maWdzRm9sZGVyLCAnY29uZmlnLmRlZmF1bHQuanNvbicpXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaXNQcm9kdWN0aW9uID0gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nO1xyXG4gIGlmIChpc1Byb2R1Y3Rpb24pIHtcclxuICAgIHJldHVybiBrbm93bkNvbmZpZ3MuZGVmYXVsdDtcclxuICB9XHJcblxyXG4gIC8vIERldlxyXG4gIGNvbnN0IGlzSGF2ZUxvY2FsT3ZlcnJpZGUgPSBleGlzdHNTeW5jKGtub3duQ29uZmlncy5sb2NhbCk7XHJcbiAgcmV0dXJuIGlzSGF2ZUxvY2FsT3ZlcnJpZGVcclxuICAgID8ga25vd25Db25maWdzLmxvY2FsXHJcbiAgICA6IGtub3duQ29uZmlncy5kZWZhdWx0XHJcbn1cclxuXHJcblxyXG5pZiAocHJvY2Vzcy5hcmd2WzFdID09PSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpIHtcclxuICAvLyBJZiB0aGlzIHNjcmlwdCBydW5uaW5nIGZyb20gY2xpXHJcbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoXHJcbiAgICBzZWxlY3RSdW50aW1lQ29uZmlnKFxyXG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA/PyAnZGV2ZWxvcG1lbnQnLFxyXG4gICAgICBwcm9jZXNzLmVudixcclxuICAgICAgdHJ1ZVxyXG4gICAgKSArICdcXG4nKTtcclxufSIsICJpbXBvcnQgQWp2IGZyb20gJ2Fqdic7XHJcbmltcG9ydCB0c2ogZnJvbSAndHMtanNvbi1zY2hlbWEtZ2VuZXJhdG9yJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBidWlsZFNjaGVtZSgpIHtcclxuICBjb25zdCBjb25maWcgPSB7XHJcbiAgICBwYXRoOiAnc3JjL2NvcmUvYXBwX2NvbmZpZy9pbmRleC50cycsXHJcbiAgICB0c2NvbmZpZzogJy4vdHNjb25maWcuanNvbicsXHJcbiAgICB0eXBlOiAnQXBwQ29uZmlnJyxcclxuICAgIHNraXBUeXBlQ2hlY2s6IHRydWUsXHJcbiAgfTtcclxuICBjb25zdCBzY2hlbWEgPSB0c2ouY3JlYXRlR2VuZXJhdG9yKGNvbmZpZykuY3JlYXRlU2NoZW1hKGNvbmZpZy50eXBlKTtcclxuICByZXR1cm4gc2NoZW1hO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVDb25maWcoY29uZmlnLCBzY2hlbWEpIHtcclxuICBjb25zdCBhanYgPSBuZXcgQWp2KCk7XHJcbiAgY29uc3QgdmFsaWQgPSBhanYudmFsaWRhdGUoc2NoZW1hLCBjb25maWcpO1xyXG4gIGlmICghdmFsaWQpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoYWp2LmVycm9ycyk7XHJcbiAgICB0aHJvdyBFcnJvcignQ29uZmlndXJhdGlvbiBpcyBub3QgdmFsaWQnKTtcclxuICB9XHJcbn1cclxuIiwgImltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcbmltcG9ydCBwb3N0Y3NzTm9ybWFsaXplIGZyb20gJ3Bvc3Rjc3Mtbm9ybWFsaXplJztcbmltcG9ydCBwb3N0Y3NzTmVzdGVkIGZyb20gJ3Bvc3Rjc3MtbmVzdGVkJztcbmltcG9ydCBwb3N0Y3NzQ3VzdG9tTWVkaWEgZnJvbSAncG9zdGNzcy1jdXN0b20tbWVkaWEnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcGx1Z2luczogW1xuICAgIHBvc3Rjc3NDdXN0b21NZWRpYSh7XG4gICAgICBpbXBvcnRGcm9tOiAnLi9ub2RlX21vZHVsZXMvQGtvbnR1cmlvL2RlZmF1bHQtdGhlbWUvdmFyaWFibGVzLmNzcydcbiAgICB9KSxcbiAgICBhdXRvcHJlZml4ZXIsXG4gICAgcG9zdGNzc05vcm1hbGl6ZSxcbiAgICBwb3N0Y3NzTmVzdGVkLFxuICBdXG59IiwgImltcG9ydCB7IFByb3h5T3B0aW9ucyB9IGZyb20gJ3ZpdGUnO1xuXG4vKipcbiAqIFRoaXMgcHJveHkgaGVscCB1cyBwcm94eSBtYXBib3ggdGlsZXMgcmVxdWVzdHNcbiAqIEZvciBleGFtcGxlLCByZWNvcmQgbGlrZTpcbiAqICcvdGlsZXMvc3RhdHMnOiAnaHR0cHM6Ly9kaXNhc3Rlci5uaW5qYScsXG4gKiB3aWxsIGZvcmNlIG1hcGJveCB0YWtlIHRpbGVzIGZyb20gaHR0cHM6Ly9kaXNhc3Rlci5uaW5qYSBkb21haW5cbiAqL1xuXG5cbmFzeW5jIGZ1bmN0aW9uIGdldExvY2FsQ29uZmlnKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGltcG9ydCgnLi9jb25maWdzL3Byb3h5LWNvbmZpZy5sb2NhbCcpO1xuICAgIGNvbnNvbGUubG9nKCdBcHBseWluZyBsb2NhbCB2aXRlIHByb3h5IGNvbmZpZyBmaWxlIGZyb20gLi9jb25maWdzL3Byb3h5LWNvbmZpZy5sb2NhbC5qcycpO1xuICAgIHJldHVybiByZXMuZGVmYXVsdDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBpbXBvcnQoJy4vY29uZmlncy9wcm94eS1jb25maWcuZGVmYXVsdCcpO1xuICAgICAgY29uc29sZS5sb2coJ0FwcGx5aW5nIGxvY2FsIHZpdGUgcHJveHkgY29uZmlnIGZpbGUgZnJvbSAuL2NvbmZpZ3MvcHJveHktY29uZmlnLmRlZmF1bHQuanMnKTtcbiAgICAgIHJldHVybiByZXMuZGVmYXVsdDtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdOb3QgZm91bmQgYW55IHByb3h5IGNvbmZpZ3MnKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHByb3h5Q29uZmlnOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBQcm94eU9wdGlvbnM+ID0gYXdhaXQgZ2V0TG9jYWxDb25maWcoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUFPO0FBQVA7QUFBQTtBQUFBO0FBQUEsSUFBTywrQkFBUTtBQUFBLE1B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
