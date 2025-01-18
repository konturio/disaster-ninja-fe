import { configRepo } from '~core/config';
import { apiClient } from '~core/apiClientInstance';
import { i18n } from '~core/localization';

export function getAsset(asset: string, abortController?: AbortController) {
  const endpoint = `/apps/${configRepo.get().id}/assets`;
  return apiClient.get(`${endpoint}/${asset}`, undefined, {
    headers: { 'user-language': i18n.instance.language },
    signal: abortController ? abortController.signal : undefined,
    authRequirement: apiClient.AUTH_REQUIREMENT.OPTIONAL,
  });
}
