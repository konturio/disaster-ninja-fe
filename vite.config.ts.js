// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";
import { injectHtml } from "vite-plugin-html";

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

// scripts/selectConfig.mjs
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import process2 from "process";
var relativePath = (path2) => resolve(dirname(fileURLToPath(import.meta.url)), path2);
function configInjector(pathToDest) {
  if (!existsSync(dirname(pathToDest))) {
    mkdirSync(dirname(pathToDest), { recursive: true });
  }
  return (pathToConfig) => {
    copyFileSync(pathToConfig, pathToDest);
    console.log(`Config "${pathToConfig}" will be used`);
    return `Config "${pathToConfig}" will be used`;
  };
}
function selectRuntimeConfig(mode, env, isSelfInvoked = false) {
  const configsFolder = isSelfInvoked ? relativePath("../configs") : relativePath("./configs");
  const knownConfigs = {
    local: resolve(configsFolder, "config.local.js"),
    default: resolve(configsFolder, "config.default.js")
  };
  const publicFolder = isSelfInvoked ? relativePath("../public/config") : relativePath("./public/config");
  const pathToDest = env.DEST_PATH ?? resolve(publicFolder, "appconfig.js");
  const isProduction = mode === "production";
  const useConfig = configInjector(pathToDest);
  if (isProduction) {
    return useConfig(knownConfigs.default);
  }
  const isHaveLocalOverride = existsSync(knownConfigs.local);
  return useConfig(isHaveLocalOverride ? knownConfigs.local : knownConfigs.default);
}
if (process2.argv[1] === fileURLToPath(import.meta.url)) {
  process2.stdout.write(selectRuntimeConfig(process2.env.NODE_ENV ?? "development", process2.env, true) + "\n");
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
var proxyConfig = {};

// package.json
var name = "disaster-ninja-fe";
var version = "2.0.26-beta";
var private2 = true;
var homepage = "/active/";
var type = "module";
var license = "MIT";
var scripts = {
  dev: "vite",
  build: "vite build",
  serve: "vite preview",
  typecheck: "tsc --noEmit",
  "typecheck:watch": "tsc --noEmit --watch",
  "preupgrade:kontur": "node ./scripts/updateKonturPackages.mjs",
  "upgrade:kontur": "npm cache clean --force && npm update $(node ./scripts/updateKonturPackages.mjs)",
  "lint-staged": "lint-staged",
  "test:unit": "vitest",
  coverage: "vitest run --coverage",
  lint: "npm-run-all lint:js lint:css depcruise",
  "lint:js": "eslint --quiet  --ext .tsx,.ts src/",
  "lint:css": "stylelint ./src/**/*.css",
  depcruise: "depcruise --config .dependency-cruiser.cjs src",
  postinstall: "run-s fixtypes patch",
  fixtypes: "node ./scripts/fix-deckgl-types.mjs",
  patch: "patch-package",
  "docker:build": "docker build -f ./Dockerfile ./ -t ghcr.io/konturio/disaster-ninja-fe:latest",
  "docker:run": "docker run --rm -d -p 80:80/tcp ghcr.io/konturio/disaster-ninja-fe:latest",
  prepare: "node ./scripts/husky-prepare.js"
};
var lint_staged = {
  "*/**/*.{ts, tsx}": [
    "eslint --fix --cache"
  ],
  "*/**/*.css": [
    "stylelint"
  ],
  "*/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
    "prettier --write"
  ]
};
var browserslist = {
  production: [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  development: [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
};
var dependencies = {
  "@deck.gl/core": "^8.7.11",
  "@deck.gl/extensions": "^8.6.4",
  "@deck.gl/geo-layers": "^8.5.4",
  "@deck.gl/layers": "^8.5.4",
  "@deck.gl/mapbox": "^8.6.4",
  "@deck.gl/mesh-layers": "^8.5.4",
  "@konturio/default-icons": "^2.0.0-alpha.22",
  "@konturio/default-theme": "^2.4.0-alpha.11",
  "@konturio/ui-kit": "^3.0.0-alpha.41",
  "@loaders.gl/core": "^3.2.3",
  "@nebula.gl/edit-modes": "1.0.2-alpha.0",
  "@nebula.gl/layers": "1.0.2-alpha.0",
  "@reatom/core": "^2.0.20",
  "@reatom/react": "^2.0.15",
  "@testing-library/react": "^12.0.0",
  "@testing-library/react-hooks": "^8.0.0",
  "@turf/area": "6.x",
  "@turf/bbox": "^6.0.1",
  "@turf/centroid": "^6.5.0",
  "@turf/distance": ">=4.0.0",
  "@turf/great-circle": "^6.3.0",
  "@turf/helpers": "^6.5.0",
  "@turf/kinks": "^6.3.0",
  "@types/file-saver": "^2.0.3",
  "@types/geojson": "^7946.0.7",
  "@types/node": "^12.0.0",
  "@types/papaparse": "^5.3.1",
  "@types/react": "^17.0.16",
  "@types/react-dom": "^17.0.9",
  "@types/react-router-dom": "^5.1.8",
  "@types/react-transition-group": "^4.4.3",
  "@types/sinon": "^10.0.6",
  "@typescript-eslint/eslint-plugin": "^5.27.1",
  "@typescript-eslint/parser": "^5.27.1",
  "@vitejs/plugin-react": "^1.3.2",
  autoprefixer: "^10.4.0",
  axios: "^0.27.2",
  "axios-mock-adapter": "^1.20.0",
  clsx: "^1.1.0",
  "color-interpolate": "^1.0.5",
  "core-js": "^3.22.8",
  cpr: "^3.0.1",
  "date-fns": "^2.23.0",
  "dependency-cruiser": "^11.8.0",
  "dnd-core": "^16.0.1",
  eslint: "^7.32.0",
  "eslint-import-resolver-typescript": "^2.7.1",
  "eslint-plugin-import": "^2.26.0",
  "eslint-plugin-react": "^7.28.0",
  "eslint-plugin-react-hooks": "^4.2.0",
  "file-saver": "^2.0.5",
  "geojson-polygon-self-intersections": "^1.2.1",
  "happy-dom": "^5.2.0",
  "hash-wasm": "^4.9.0",
  hsluv: "^0.1.0",
  i18next: "^20.4.0",
  "i18next-browser-languagedetector": "^6.1.2",
  "jwt-decode": "^3.1.2",
  "maplibre-gl": "^1.15.2",
  nanoid: "^3.1.30",
  "node-fetch": "^3.1.0",
  "npm-run-all": "^4.1.5",
  papaparse: "^5.3.1",
  "patch-package": "^6.4.7",
  "postcss-custom-media": "^8.0.0",
  "postcss-loader": "^6.1.1",
  "postcss-nested": "^5.0.6",
  "postcss-normalize": "8.0.1",
  prettier: "^2.3.2",
  react: "^17.0.2",
  "react-dnd": "^15.1.1",
  "react-dnd-html5-backend": "^15.1.2",
  "react-dom": "^17.0.2",
  "react-i18next": "^11.11.4",
  "react-lazily": "^0.9.0",
  "react-markdown": "^7.1.0",
  "react-router": "^5.2.1",
  "react-router-cache-route": "^1.11.1",
  "react-router-dom": "^5.3.0",
  "react-transition-group": "^4.4.2",
  "react-virtuoso": "^2.2.3",
  "rollup-plugin-visualizer": "^5.5.2",
  sinon: "^12.0.1",
  stylelint: "^14.1.0",
  "stylelint-config-recommended": "^6.0.0",
  "stylelint-config-standard": "^24.0.0",
  typescript: "4.3.5",
  "use-subscription": "^1.5.1",
  uuid: "^8.3.2",
  vite: "^2.6.14",
  "vite-plugin-html": "^2.1.1",
  vitest: "^0.14.1"
};
var devDependencies = {
  "@types/uuid": "^8.3.4",
  husky: "^8.0.1",
  "lint-staged": "^13.0.0",
  "react-test-renderer": "^17.0.0"
};
var package_default = {
  name,
  version,
  private: private2,
  homepage,
  type,
  license,
  scripts,
  "lint-staged": lint_staged,
  browserslist,
  dependencies,
  devDependencies
};

// vite.config.ts
var relative = (folder) => path.resolve("C:\\code\\kontur\\disaster-ninja-fe", folder);
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, "env");
  selectRuntimeConfig(mode, env);
  return defineConfig({
    base: mode === "development" ? "/" : package_default.homepage,
    build: {
      minify: mode === "development" ? false : true,
      sourcemap: true,
      rollupOptions: {
        plugins: [!!env.VITE_ANALYZE_BUNDLE && visualizer({ open: true })]
      }
    },
    plugins: [
      react(),
      mode === "production" && build_info_plugin_default(),
      injectHtml({
        data: {
          ...env,
          mode
        }
      })
    ],
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
      proxy: proxyConfig
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy9idWlsZC1pbmZvLXBsdWdpbi50cyIsICJzY3JpcHRzL3NlbGVjdENvbmZpZy5tanMiLCAicG9zdGNzcy5jb25maWcudHMiLCAidml0ZS5wcm94eS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgaW5qZWN0SHRtbCB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnO1xuaW1wb3J0IHZpdGVCdWlsZEluZm9QbHVnaW4gZnJvbSAnLi9zY3JpcHRzL2J1aWxkLWluZm8tcGx1Z2luJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCBzZWxlY3RDb25maWcgZnJvbSAnLi9zY3JpcHRzL3NlbGVjdENvbmZpZy5tanMnO1xuaW1wb3J0IHBvc3Rjc3NDb25maWcgZnJvbSAnLi9wb3N0Y3NzLmNvbmZpZyc7XG5pbXBvcnQgeyBwcm94eUNvbmZpZyB9IGZyb20gJy4vdml0ZS5wcm94eSc7XG5pbXBvcnQgcGFja2FnZUpzb24gZnJvbSAnLi9wYWNrYWdlLmpzb24nO1xuXG5jb25zdCByZWxhdGl2ZSA9IChmb2xkZXI6IHN0cmluZykgPT4gcGF0aC5yZXNvbHZlKFwiQzpcXFxcY29kZVxcXFxrb250dXJcXFxcZGlzYXN0ZXItbmluamEtZmVcIiwgZm9sZGVyKTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsICdlbnYnKTtcbiAgc2VsZWN0Q29uZmlnKG1vZGUsIGVudilcbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XG4gICAgYmFzZTogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyA/ICcvJyA6IHBhY2thZ2VKc29uLmhvbWVwYWdlLFxuICAgIGJ1aWxkOiB7XG4gICAgICBtaW5pZnk6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcgPyBmYWxzZSA6IHRydWUsXG4gICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIHBsdWdpbnM6IFshIWVudi5WSVRFX0FOQUxZWkVfQlVORExFICYmIHZpc3VhbGl6ZXIoeyBvcGVuOiB0cnVlIH0pXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCgpLFxuICAgICAgbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nICYmIHZpdGVCdWlsZEluZm9QbHVnaW4oKSxcbiAgICAgIGluamVjdEh0bWwoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgLi4uZW52LFxuICAgICAgICAgIG1vZGUsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczogcG9zdGNzc0NvbmZpZyxcbiAgICB9LFxuICAgIGVzYnVpbGQ6IHtcbiAgICAgIC8vIEF2b2lkIGNvbmZsaWN0aW5nIHdpdGggXCJpbXBvcnQgUmVhY3RcIlxuICAgICAganN4SW5qZWN0OiAnaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgRnJhZ21lbnQgfSBmcm9tIFwicmVhY3RcIicsXG4gICAgICBqc3hGYWN0b3J5OiAnY3JlYXRlRWxlbWVudCcsXG4gICAgICBqc3hGcmFnbWVudDogJ0ZyYWdtZW50JyxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICd+Y29tcG9uZW50cyc6IHJlbGF0aXZlKCcuL3NyYy9jb21wb25lbnRzJyksXG4gICAgICAgICd+dmlld3MnOiByZWxhdGl2ZSgnLi9zcmMvdmlld3MnKSxcbiAgICAgICAgJ35jb25maWcnOiByZWxhdGl2ZSgnLi9zcmMvY29uZmlnJyksXG4gICAgICAgICd+dXRpbHMnOiByZWxhdGl2ZSgnLi9zcmMvdXRpbHMnKSxcbiAgICAgICAgJ35zZXJ2aWNlcyc6IHJlbGF0aXZlKCcuL3NyYy9zZXJ2aWNlcycpLFxuICAgICAgICAnfmFwcE1vZHVsZSc6IHJlbGF0aXZlKCcuL3NyYy9yZWR1eC1tb2R1bGVzL2FwcE1vZHVsZScpLFxuICAgICAgICAnfmNvcmUnOiByZWxhdGl2ZSgnLi9zcmMvY29yZScpLFxuICAgICAgICAnfmZlYXR1cmVzJzogcmVsYXRpdmUoJy4vc3JjL2ZlYXR1cmVzJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwcm94eTogcHJveHlDb25maWcsXG4gICAgfSxcbiAgfSk7XG59O1xuXG4iLCAiaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGV4ZWNTeW5jIGFzIGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcblxuY29uc3QgZGF0YVNvdXJjZXMgPSB7XG4gIEdJVF9CUkFOQ0g6ICgpID0+IGV4ZWMoJ2dpdCByZXYtcGFyc2UgLS1hYmJyZXYtcmVmIEhFQUQnKS50b1N0cmluZygpLnRyaW0oKSxcbiAgR0lUX0NPTU1JVF9IQVNIOiAoKSA9PiBleGVjKCdnaXQgc2hvdyAtcyAtLWZvcm1hdD0laCcpLnRvU3RyaW5nKCkudHJpbSgpLFxuICBHSVRfQ09NTUlUX0ZVTExIQVNIOiAoKSA9PiBleGVjKCdnaXQgc2hvdyAtcyAtLWZvcm1hdD0lSCcpLnRvU3RyaW5nKCkudHJpbSgpLFxuICBHSVRfQ09NTUlUX1RJTUU6ICgpID0+IGV4ZWMoJ2dpdCBzaG93IC1zIC0tZm9ybWF0PSVjSScpLnRvU3RyaW5nKCkudHJpbSgpLFxuICAvLyBHSVRfQ09NTUlUX0FVVEhPUjogKCkgPT4gZXhlYygnZ2l0IHNob3cgLXMgLS1mb3JtYXQ9JWFuJykudG9TdHJpbmcoKS50cmltKCksXG4gIC8vIEdJVF9DT01NSVRfQ09NTUlURVI6ICgpID0+IGV4ZWMoJ2dpdCBzaG93IC1zIC0tZm9ybWF0PSVjbicpLnRvU3RyaW5nKCkudHJpbSgpLFxuICAvLyBHSVRfQ09NTUlUX01FU1NBR0U6ICgpID0+IGV4ZWMoJ2dpdCBzaG93IC1zIC0tZm9ybWF0PSViJykudG9TdHJpbmcoKS50cmltKCksXG4gIFBBQ0tBR0VfVkVSU0lPTjogKCkgPT4gcHJvY2Vzcy5lbnYubnBtX3BhY2thZ2VfdmVyc2lvbixcbiAgQlVJTERfVElNRTogKCkgPT4gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxufTtcblxubGV0IGVudkluamVjdGlvbkZhaWxlZCA9IGZhbHNlO1xuXG5jb25zdCBjcmVhdGVQbHVnaW4gPSAoKTogUGx1Z2luID0+IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZS1wbHVnaW4tYnVpbGQtaW5mbycsXG4gICAgY29uZmlnOiAoXywgZW52KSA9PiB7XG4gICAgICBpZiAoZW52KSB7XG4gICAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IE9iamVjdC5lbnRyaWVzKGRhdGFTb3VyY2VzKS5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgW2tleSwgZ2V0dGVyXSkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYWNjW2BpbXBvcnQubWV0YS5lbnYuJHtrZXl9YF0gPSBKU09OLnN0cmluZ2lmeShnZXR0ZXIoKSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgIH0sXG4gICAgICAgICAge30sXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB7IGRlZmluZTogdmFyaWFibGVzIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnZJbmplY3Rpb25GYWlsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgY29uZmlnUmVzb2x2ZWQoY29uZmlnKSB7XG4gICAgICBpZiAoZW52SW5qZWN0aW9uRmFpbGVkKSB7XG4gICAgICAgIGNvbmZpZy5sb2dnZXIud2FybihcbiAgICAgICAgICBgW3ZpdGUtcGx1Z2luLWJ1aWxkLWluZm9dIFZhcmlhYmxlcyB3YXMgbm90IGluamVjdGVkIGR1ZSBgICtcbiAgICAgICAgICAgIGB0byBpbmNvbXBhdGlibGUgdml0ZSB2ZXJzaW9uIChyZXF1aXJlcyB2aXRlQF4yLjAuMC1iZXRhLjY5KS5gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQbHVnaW47XG4iLCAiaW1wb3J0IHsgY29weUZpbGVTeW5jLCBleGlzdHNTeW5jLCBta2RpclN5bmMgfSBmcm9tICdub2RlOmZzJztcclxuaW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSB9IGZyb20gJ25vZGU6cGF0aCc7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xyXG5pbXBvcnQgcHJvY2VzcyBmcm9tICdwcm9jZXNzJztcclxuXHJcbmNvbnN0IHJlbGF0aXZlUGF0aCA9IHBhdGggPT4gcmVzb2x2ZShkaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSksIHBhdGgpO1xyXG5cclxuZnVuY3Rpb24gY29uZmlnSW5qZWN0b3IocGF0aFRvRGVzdCkge1xyXG4gIGlmICghZXhpc3RzU3luYyhkaXJuYW1lKHBhdGhUb0Rlc3QpKSl7XHJcbiAgICBta2RpclN5bmMoZGlybmFtZShwYXRoVG9EZXN0KSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbiAgfVxyXG4gIHJldHVybiAocGF0aFRvQ29uZmlnKSA9PiB7XHJcbiAgICBjb3B5RmlsZVN5bmMocGF0aFRvQ29uZmlnLCBwYXRoVG9EZXN0KTtcclxuICAgIGNvbnNvbGUubG9nKGBDb25maWcgXCIke3BhdGhUb0NvbmZpZ31cIiB3aWxsIGJlIHVzZWRgKVxyXG4gICAgcmV0dXJuIGBDb25maWcgXCIke3BhdGhUb0NvbmZpZ31cIiB3aWxsIGJlIHVzZWRgO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRoaXMgc2NyaXB0IHNlbGVjdCByaWdodCBjb25maWcgZGVwZW5kaW5nIG9uIGVudi5cclxuICogSW4gcHJvZHVjdGlvbiBtb2RlIGluIHdpbGwgdXNlIGRlZmF1bHQgY29uZmlnLCBpbiBkZXZlbG9wbWVudCBpdCBwcmVmZXIgdG8gdXNlIGxvY2FsIGNvbmZpZ1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2VsZWN0UnVudGltZUNvbmZpZyhtb2RlLCBlbnYsIGlzU2VsZkludm9rZWQgPSBmYWxzZSkge1xyXG4gIC8vIFNldHVwIHBhdGhcclxuICBjb25zdCBjb25maWdzRm9sZGVyID0gaXNTZWxmSW52b2tlZCA/IHJlbGF0aXZlUGF0aCgnLi4vY29uZmlncycpIDogcmVsYXRpdmVQYXRoKCcuL2NvbmZpZ3MnKTtcclxuICBjb25zdCBrbm93bkNvbmZpZ3MgPSB7XHJcbiAgICBsb2NhbDogcmVzb2x2ZShjb25maWdzRm9sZGVyLCAnY29uZmlnLmxvY2FsLmpzJyksXHJcbiAgICBkZWZhdWx0OiByZXNvbHZlKGNvbmZpZ3NGb2xkZXIsICdjb25maWcuZGVmYXVsdC5qcycpXHJcbiAgfTtcclxuICBjb25zdCBwdWJsaWNGb2xkZXIgPSBpc1NlbGZJbnZva2VkID8gcmVsYXRpdmVQYXRoKCcuLi9wdWJsaWMvY29uZmlnJykgOiByZWxhdGl2ZVBhdGgoJy4vcHVibGljL2NvbmZpZycpO1xyXG4gIGNvbnN0IHBhdGhUb0Rlc3QgPSBlbnYuREVTVF9QQVRIID8/IHJlc29sdmUocHVibGljRm9sZGVyLCAnYXBwY29uZmlnLmpzJyk7XHJcblxyXG4gIC8vIENoZWNrIGVudlxyXG4gIGNvbnN0IGlzUHJvZHVjdGlvbiA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJztcclxuICBjb25zdCB1c2VDb25maWcgPSBjb25maWdJbmplY3RvcihwYXRoVG9EZXN0KVxyXG5cclxuICAvLyBQcm9kXHJcbiAgaWYgKGlzUHJvZHVjdGlvbikge1xyXG4gICAgcmV0dXJuIHVzZUNvbmZpZyhrbm93bkNvbmZpZ3MuZGVmYXVsdCk7XHJcbiAgfVxyXG5cclxuICAvLyBEZXZcclxuICBjb25zdCBpc0hhdmVMb2NhbE92ZXJyaWRlID0gZXhpc3RzU3luYyhrbm93bkNvbmZpZ3MubG9jYWwpO1xyXG4gIHJldHVybiB1c2VDb25maWcoXHJcbiAgICBpc0hhdmVMb2NhbE92ZXJyaWRlXHJcbiAgICAgID8ga25vd25Db25maWdzLmxvY2FsXHJcbiAgICAgIDoga25vd25Db25maWdzLmRlZmF1bHRcclxuICApO1xyXG59XHJcblxyXG5cclxuaWYgKHByb2Nlc3MuYXJndlsxXSA9PT0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSB7XHJcbiAgLy8gSWYgdGhpcyBzY3JpcHQgcnVubmluZyBmcm9tIGNsaVxyXG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKFxyXG4gICAgc2VsZWN0UnVudGltZUNvbmZpZyhcclxuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPz8gJ2RldmVsb3BtZW50JyxcclxuICAgICAgcHJvY2Vzcy5lbnYsXHJcbiAgICAgIHRydWVcclxuICAgICkgKyAnXFxuJyk7XHJcbn0iLCAiaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInO1xuaW1wb3J0IHBvc3Rjc3NOb3JtYWxpemUgZnJvbSAncG9zdGNzcy1ub3JtYWxpemUnO1xuaW1wb3J0IHBvc3Rjc3NOZXN0ZWQgZnJvbSAncG9zdGNzcy1uZXN0ZWQnO1xuaW1wb3J0IHBvc3Rjc3NDdXN0b21NZWRpYSBmcm9tICdwb3N0Y3NzLWN1c3RvbS1tZWRpYSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBwbHVnaW5zOiBbXG4gICAgcG9zdGNzc0N1c3RvbU1lZGlhKHtcbiAgICAgIGltcG9ydEZyb206ICcuL25vZGVfbW9kdWxlcy9Aa29udHVyaW8vZGVmYXVsdC10aGVtZS92YXJpYWJsZXMuY3NzJ1xuICAgIH0pLFxuICAgIGF1dG9wcmVmaXhlcixcbiAgICBwb3N0Y3NzTm9ybWFsaXplLFxuICAgIHBvc3Rjc3NOZXN0ZWQsXG4gIF1cbn0iLCAiaW1wb3J0IHsgUHJveHlPcHRpb25zIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcGFja2FnZUpzb24gZnJvbSAnLi9wYWNrYWdlLmpzb24nO1xuY29uc3QgaG9zdCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnO1xuXG5leHBvcnQgY29uc3QgcHJveHlDb25maWc6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IFByb3h5T3B0aW9ucz4gPSB7XG4gIC8qKlxuICAgKiBUaGlzIHByb3h5IGhlbHAgdXMgcHJveHkgbWFwYm94IHRpbGVzIHJlcXVlc3RzIFxuICAgKiBGb3IgZXhhbXBsZSwgcmVjb3JkIGxpa2U6XG4gICAqICcvdGlsZXMvc3RhdHMnOiAnaHR0cHM6Ly9kaXNhc3Rlci5uaW5qYScsXG4gICAqIHdpbGwgZm9yY2UgbWFwYm94IHRha2UgdGlsZXMgZnJvbSBodHRwczovL2Rpc2FzdGVyLm5pbmphIGRvbWFpblxuICAgKi9cbn1cblxuXG4vKiBSZXBsYWNlIGFwaSB1cmwgdGhhdCByZXF1aXJlIENPUlMgdG8gcHJveHkgKi9cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlVXJsV2l0aFByb3h5KG9yaWdpbmFsVXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gT2JqZWN0LmVudHJpZXMocHJveHlDb25maWcpLnJlZHVjZSgodXJsLCBydWxlKSA9PiB7XG4gICAgY29uc3QgcHJveHlUYXJnZXQgPSB0eXBlb2YgcnVsZVsxXSA9PT0gJ3N0cmluZycgPyBydWxlWzFdIDogcnVsZVsxXS50YXJnZXQ7XG4gICAgaWYgKHByb3h5VGFyZ2V0KSB7XG4gICAgICByZXR1cm4gdXJsLnJlcGxhY2UoU3RyaW5nKHByb3h5VGFyZ2V0KSwgaG9zdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuICB9LCBvcmlnaW5hbFVybCk7XG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0hBO0FBRUEsSUFBTSxjQUFjO0FBQUEsRUFDbEIsWUFBWSxNQUFNLEtBQUssaUNBQWlDLEVBQUUsU0FBUyxFQUFFLEtBQUs7QUFBQSxFQUMxRSxpQkFBaUIsTUFBTSxLQUFLLHlCQUF5QixFQUFFLFNBQVMsRUFBRSxLQUFLO0FBQUEsRUFDdkUscUJBQXFCLE1BQU0sS0FBSyx5QkFBeUIsRUFBRSxTQUFTLEVBQUUsS0FBSztBQUFBLEVBQzNFLGlCQUFpQixNQUFNLEtBQUssMEJBQTBCLEVBQUUsU0FBUyxFQUFFLEtBQUs7QUFBQSxFQUl4RSxpQkFBaUIsTUFBTSxRQUFRLElBQUk7QUFBQSxFQUNuQyxZQUFZLE1BQU0sSUFBSSxLQUFLLEVBQUUsWUFBWTtBQUMzQztBQUVBLElBQUkscUJBQXFCO0FBRXpCLElBQU0sZUFBZSxNQUFjO0FBQ2pDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFFBQVEsQ0FBQyxHQUFHLFFBQVE7QUFDbEIsVUFBSSxLQUFLO0FBQ1AsY0FBTSxZQUFZLE9BQU8sUUFBUSxXQUFXLEVBQUUsT0FDNUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxZQUFZO0FBQ3RCLGNBQUk7QUFDRixnQkFBSSxtQkFBbUIsU0FBUyxLQUFLLFVBQVUsT0FBTyxDQUFDO0FBQUEsVUFDekQsU0FBUyxHQUFQO0FBQ0Esb0JBQVEsTUFBTSxDQUFDO0FBQUEsVUFDakI7QUFDQSxpQkFBTztBQUFBLFFBQ1QsR0FDQSxDQUFDLENBQ0g7QUFDQSxlQUFPLEVBQUUsUUFBUSxVQUFVO0FBQUEsTUFDN0IsT0FBTztBQUNMLDZCQUFxQjtBQUFBLE1BQ3ZCO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZSxRQUFRO0FBQ3JCLFVBQUksb0JBQW9CO0FBQ3RCLGVBQU8sT0FBTyxLQUNaLHNIQUVGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLDRCQUFROzs7QUNqRGY7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNLGVBQWUsV0FBUSxRQUFRLFFBQVEsY0FBYyxZQUFZLEdBQUcsQ0FBQyxHQUFHLEtBQUk7QUFFbEYsd0JBQXdCLFlBQVk7QUFDbEMsTUFBSSxDQUFDLFdBQVcsUUFBUSxVQUFVLENBQUMsR0FBRTtBQUNuQyxjQUFVLFFBQVEsVUFBVSxHQUFHLEVBQUUsV0FBVyxLQUFLLENBQUM7QUFBQSxFQUNwRDtBQUNBLFNBQU8sQ0FBQyxpQkFBaUI7QUFDdkIsaUJBQWEsY0FBYyxVQUFVO0FBQ3JDLFlBQVEsSUFBSSxXQUFXLDRCQUE0QjtBQUNuRCxXQUFPLFdBQVc7QUFBQSxFQUNwQjtBQUNGO0FBTWUsNkJBQTZCLE1BQU0sS0FBSyxnQkFBZ0IsT0FBTztBQUU1RSxRQUFNLGdCQUFnQixnQkFBZ0IsYUFBYSxZQUFZLElBQUksYUFBYSxXQUFXO0FBQzNGLFFBQU0sZUFBZTtBQUFBLElBQ25CLE9BQU8sUUFBUSxlQUFlLGlCQUFpQjtBQUFBLElBQy9DLFNBQVMsUUFBUSxlQUFlLG1CQUFtQjtBQUFBLEVBQ3JEO0FBQ0EsUUFBTSxlQUFlLGdCQUFnQixhQUFhLGtCQUFrQixJQUFJLGFBQWEsaUJBQWlCO0FBQ3RHLFFBQU0sYUFBYSxJQUFJLGFBQWEsUUFBUSxjQUFjLGNBQWM7QUFHeEUsUUFBTSxlQUFlLFNBQVM7QUFDOUIsUUFBTSxZQUFZLGVBQWUsVUFBVTtBQUczQyxNQUFJLGNBQWM7QUFDaEIsV0FBTyxVQUFVLGFBQWEsT0FBTztBQUFBLEVBQ3ZDO0FBR0EsUUFBTSxzQkFBc0IsV0FBVyxhQUFhLEtBQUs7QUFDekQsU0FBTyxVQUNMLHNCQUNJLGFBQWEsUUFDYixhQUFhLE9BQ25CO0FBQ0Y7QUFHQSxJQUFJLFNBQVEsS0FBSyxPQUFPLGNBQWMsWUFBWSxHQUFHLEdBQUc7QUFFdEQsV0FBUSxPQUFPLE1BQ2Isb0JBQ0UsU0FBUSxJQUFJLFlBQVksZUFDeEIsU0FBUSxLQUNSLElBQ0YsSUFBSSxJQUFJO0FBQ1o7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU8seUJBQVE7QUFBQSxFQUNiLFNBQVM7QUFBQSxJQUNQLG1CQUFtQjtBQUFBLE1BQ2pCLFlBQVk7QUFBQSxJQUNkLENBQUM7QUFBQSxJQUNEO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQ0Y7OztBQ1ZPLElBQU0sY0FBcUQsQ0FPbEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUpDQSxJQUFNLFdBQVcsQ0FBQyxXQUFtQixLQUFLLFFBQVEsdUNBQXVDLE1BQU07QUFHL0YsSUFBTyxzQkFBUSxDQUFDLEVBQUUsV0FBVztBQUMzQixRQUFNLE1BQU0sUUFBUSxNQUFNLEtBQUs7QUFDL0Isc0JBQWEsTUFBTSxHQUFHO0FBQ3RCLFNBQU8sYUFBYTtBQUFBLElBQ2xCLE1BQU0sU0FBUyxnQkFBZ0IsTUFBTSxnQkFBWTtBQUFBLElBQ2pELE9BQU87QUFBQSxNQUNMLFFBQVEsU0FBUyxnQkFBZ0IsUUFBUTtBQUFBLE1BQ3pDLFdBQVc7QUFBQSxNQUNYLGVBQWU7QUFBQSxRQUNiLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSx1QkFBdUIsV0FBVyxFQUFFLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFBQSxNQUNuRTtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFNBQVMsZ0JBQWdCLDBCQUFvQjtBQUFBLE1BQzdDLFdBQVc7QUFBQSxRQUNULE1BQU07QUFBQSxVQUNKLEdBQUc7QUFBQSxVQUNIO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxJQUNYO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFFUCxXQUFXO0FBQUEsTUFDWCxZQUFZO0FBQUEsTUFDWixhQUFhO0FBQUEsSUFDZjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsZUFBZSxTQUFTLGtCQUFrQjtBQUFBLFFBQzFDLFVBQVUsU0FBUyxhQUFhO0FBQUEsUUFDaEMsV0FBVyxTQUFTLGNBQWM7QUFBQSxRQUNsQyxVQUFVLFNBQVMsYUFBYTtBQUFBLFFBQ2hDLGFBQWEsU0FBUyxnQkFBZ0I7QUFBQSxRQUN0QyxjQUFjLFNBQVMsK0JBQStCO0FBQUEsUUFDdEQsU0FBUyxTQUFTLFlBQVk7QUFBQSxRQUM5QixhQUFhLFNBQVMsZ0JBQWdCO0FBQUEsTUFDeEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixPQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogW10KfQo=
