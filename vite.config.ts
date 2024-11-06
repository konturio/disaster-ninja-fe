/// <reference types="vitest" />
import { defineConfig, HtmlTagDescriptor, loadEnv, UserConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react-swc';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';
import viteBuildInfoPlugin from './scripts/build-info-plugin';
import { codecovVitePlugin } from '@codecov/vite-plugin';
// @ts-ignore
import { selectConfig, useConfig } from './scripts/select-config.mjs';
// @ts-ignore
import { buildScheme, validateConfig } from './scripts/build-config-scheme.mjs';
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
      target: 'esnext',
      chunkSizeWarningLimit: 1000,
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
          manualChunks: {
            react: ['react', 'react-dom'],
            // Add other common dependencies
          },
        },
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
      // Codecov Vite plugin after all other plugins
      codecovVitePlugin({
        debug: true,
        enableBundleAnalysis: true, // !!process.env.CODECOV_TOKEN,
        bundleName: 'disaster-ninja-fe', //process.env.GITHUB_REPOSITORY
        uploadToken: process.env.CODECOV_TOKEN,
        gitService: 'github',
      }),
      buildSizeReport({
        filename: './size-report.json',
      }),
      mode === 'development' && mkcert(),
    ],
    css: {
      devSourcemap: true,
    },
    resolve: {
      // dedupe: ['@loaders.gl/worker-utils'],
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
        provider: 'v8',
        include: ['src/**/*.[jt]s?(x)'],
        exclude: [
          '**/*.{test,spec,fixture}.?(c|m)[jt]s?(x)',
          '**/__test__/**',
          '**/{tests,mocks}/**',
        ],
      },
      include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'], // '**\/*.{test,spec}.?(c|m)[jt]s?(x)'
      exclude: ['**/node_modules/**', 'e2e/**', 'dist/**', 'coverage/**', 'scripts/**'],
    },
  });

  return cfg;
};
