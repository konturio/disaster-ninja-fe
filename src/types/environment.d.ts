// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

declare global {
  interface RuntimeConfig {
    API_URL: string;
  }
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
