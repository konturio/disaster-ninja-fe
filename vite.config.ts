import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import { injectHtml } from 'vite-plugin-html';
import viteBuildInfoPlugin from './scripts/build-info-plugin';
// @ts-ignore
import { selectConfig, useConfig } from './scripts/select-config.mjs';
// @ts-ignore
import { buildScheme, validateConfig } from './scripts/build-config-scheme.mjs';

import postcssConfig from './postcss.config';
import { proxyConfig } from './vite.proxy';
import packageJson from './package.json';

const relative = (folder: string) => path.resolve(__dirname, folder);

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, 'env');
  const config = useConfig(selectConfig(mode), env.DEST_PATH);
  validateConfig(config, buildScheme());
  return defineConfig({
    base: mode === 'development' ? '/' : packageJson.homepage,
    build: {
      minify: mode === 'development' ? false : true,
      sourcemap: true,
      rollupOptions: {
        plugins: [!!env.VITE_ANALYZE_BUNDLE && visualizer({ open: true })],
      },
    },
    plugins: [
      react(),
      mode === 'production' && viteBuildInfoPlugin(),
      injectHtml({
        data: {
          ...env,
          mode,
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
      },
    },
    server: {
      proxy: proxyConfig,
    },
    define: mode === 'development' ? {
      viteProxyConfig: JSON.stringify(proxyConfig),
    } : undefined
  });
};
