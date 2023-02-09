/// <reference types="vitest" />
import path from 'path';
import { defineConfig, HtmlTagDescriptor, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';
import viteBuildInfoPlugin from './scripts/build-info-plugin';
// @ts-ignore
import { selectConfig, useConfig } from './scripts/select-config.mjs';
// @ts-ignore
import { buildScheme, validateConfig } from './scripts/build-config-scheme.mjs';
import postcssConfig from './postcss.config';
import { proxyConfig } from './vite.proxy';

const relative = (folder: string) => path.resolve(__dirname, folder);
const parseEnv = (env: Record<string, string>): Record<string, string> =>
  Object.entries(env).reduce((acc, [k, v]) => {
    try {
      acc[k] = JSON.parse(v);
    } catch (e) {}
    return acc;
  }, env);

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = parseEnv(loadEnv(mode, process.cwd()));
  const config = useConfig(selectConfig(mode), env.DEST_PATH);
  validateConfig(config, buildScheme());

  const injectRRT: HtmlTagDescriptor[] = env.VITE_DEBUG_RENDER_TRACKER
    ? [
        {
          attrs: { src: 'https://cdn.jsdelivr.net/npm/react-render-tracker' },
          injectTo: 'head',
          tag: 'script',
        },
      ]
    : [];

  const hmr = !!env.VITE_DEBUG_HMR;

  return defineConfig({
    base: `${env.VITE_BASE_PATH}${env.VITE_STATIC_PATH}`,
    build: {
      minify: mode !== 'development',
      sourcemap: true,
      rollupOptions: {
        plugins: [
          !!env.VITE_ANALYZE_BUNDLE &&
            visualizer({
              open: true,
              template: 'treemap', //'list',
              gzipSize: true,
              brotliSize: true,
              // sourcemap: true,
            }),
        ],
        output: {
          // hoistTransitiveImports: true,
          // experimentalMinChunkSize: 16000,
          // experimentalDeepDynamicChunkOptimization: true,
          manualChunks: (id: string, { getModuleInfo, getModuleIds }) => {
            // if (/lodash/.test(id)) return 'lodash';
            // if (/@deck/.test(id)) return 'deckgl';
            // if (/@loaders/.test(id)) return 'loaders';
            if (/@konturio\/default\-icons/.test(id)) return 'konturicons';
          },
        },
        treeshake: {
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
          // moduleSideEffects: false,
          preset: 'recommended',
        },
      },
    },
    plugins: [
      tsconfigPaths(),
      react(),
      // vite env data used in metrics, should be available in all environments
      viteBuildInfoPlugin(),
      createHtmlPlugin({
        inject: {
          data: {
            ...env,
            mode,
          },
          tags: [...injectRRT],
        },
      }),
    ],
    // was fixed in plugin-react to 3.0.0-alpha.2. so after 3.0.0 release this workaround can be removed
    optimizeDeps: {
      // include: ['react/jsx-runtime'],
      // disabled: false,
    },
    css: {
      postcss: postcssConfig,
    },
    esbuild: {
      // Avoid conflicting with "import React"
      // jsxInject: 'import { createElement, Fragment } from "react"',
      // jsxFactory: 'createElement',
      // jsxFragment: 'Fragment',
    },
    resolve: {
      alias: [
        {
          find: /lodash\.(.+?)/,
          replacement: 'lodash-es/$1',
        },
        {
          find: 'lodash',
          replacement: 'lodash-es',
        },
      ],
      mainFields: ['browser', 'module', 'jsnext:main', 'jsnext'],
      dedupe: [
        '@loaders.gl/*',
        // '@loaders.gl/worker-utils',
        // '@loaders.gl/loader-utils',
        '@turf/*',
      ],
    },
    server: {
      proxy: proxyConfig,
      port: 3000,
      hmr,
    },
    define:
      mode === 'development'
        ? {
            viteProxyConfig: JSON.stringify(proxyConfig),
          }
        : undefined,
    test: {
      coverage: {
        all: true,
      },
    },
  });
};
