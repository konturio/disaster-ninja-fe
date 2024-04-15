import { configRepo } from '~core/config';
import { apiClient } from '~core/apiClientInstance';

export function getAsset(asset: string, abortController?: AbortController) {
  const endpoint = `/apps/${configRepo.get().id}/assets`;
  return apiClient.get(
    `${endpoint}/${asset}`,
    undefined,
    true,
    abortController ? { signal: abortController.signal } : undefined,
  );
}
