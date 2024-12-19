/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_ANALYZE_BUNDLE: string;
  readonly VITE_BASE_PATH: string;
  readonly VITE_STATIC_PATH: string;
  readonly VITE_DEBUG_HMR: string;
  readonly VITE_DEBUG_RENDER_TRACKER: string;
  readonly VITE_DEBUG_DISABLE_REACTSTRICTMODE: string;
  readonly VITE_HTTPS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
