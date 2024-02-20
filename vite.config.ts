/// <reference types="vitest" />
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
import buildSizeReport from 'bundle-size-diff/plugin';
import mkcert from 'vite-plugin-mkcert';

const parseEnv = <T extends Record<string, string | boolean>>(
  env: Record<string, string>,
): T =>
  Object.entries(env).reduce((acc, [k, v]) => {
    try {
      acc[k] = JSON.parse(v);
    } catch (e) {}
    return acc;
  }, env) as T;

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = parseEnv<{
    VITE_BASE_PATH: string;
    VITE_STATIC_PATH: string;
    DEST_PATH: string;
    VITE_DEBUG_RENDER_TRACKER?: boolean;
    VITE_DEBUG_HMR?: boolean;
    VITE_ANALYZE_BUNDLE?: boolean;
  }>(loadEnv(mode, process.cwd()));

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

  const cfg = defineConfig({
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
            }),
        ],
        output: {
          interop: 'compat',
        },
        treeshake: {
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
          moduleSideEffects: 'no-external',
          preset: 'recommended',
          manualPureFunctions: ['forwardRef', 'createContext', 'noop'],
        },
        // experimentalLogSideEffects: true,
      },
    },
    plugins: [
      // use path resolve config from ts
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
      buildSizeReport({
        filename: './size-report.json',
      }),
      mode === 'development' && mkcert(),
    ],
    css: {
      postcss: postcssConfig,
      devSourcemap: true,
    },
    resolve: {
      dedupe: [
        '@loaders.gl/core',
        '@loaders.gl/worker-utils',
        '@loaders.gl/loader-utils',
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
        : {},
    test: {
      coverage: {
        all: true,
      },
    },
  });

  return cfg;
};
