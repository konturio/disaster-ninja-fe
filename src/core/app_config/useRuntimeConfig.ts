import { useEffect, useState } from 'react';
import { getRuntimeConfig } from './runtimeConfigService';

export function useRuntimeConfig() {
  const [config, setConfig] = useState<RuntimeConfig | null>(null);
  useEffect(() => {
    getRuntimeConfig() // defined in .gitlab-ci.yml
      .then((config) => setConfig(config))
      .catch((error) =>
        console.error('[useRuntimeConfig] Cannot read appconfig.json', error),
      );
  }, []);
  return config;
}
