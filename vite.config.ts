/// <reference types="vitest" />
import path from 'path';
import { defineConfig, HtmlTagDescriptor, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
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
        plugins: [!!env.VITE_ANALYZE_BUNDLE && visualizer({ open: true })],
      },
    },
    plugins: [
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
      include: ['react/jsx-runtime'],
    },
    css: {
      postcss: postcssConfig,
    },
    esbuild: {
      // Avoid conflicting with "import React"
      jsxInject: 'import { createElement, Fragment } from "react"',
      jsxFactory: 'createElement',
      jsxFragment: 'Fragment',
    },
    resolve: {
      alias: {
        '~components': relative('./src/components'),
        '~views': relative('./src/views'),
        '~config': relative('./src/config'),
        '~utils': relative('./src/utils'),
        '~services': relative('./src/services'),
        '~appModule': relative('./src/redux-modules/appModule'),
        '~core': relative('./src/core'),
        '~features': relative('./src/features'),
        '~widgets': relative('./src/widgets'),
      },
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
        all: true
      }
    }
  });
};
