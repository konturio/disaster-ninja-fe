import { apiClient } from '~core/apiClientInstance';
import { configRepo } from '~core/config';
import type { CurrentSubscription } from '~features/subscriptions/types';

export async function getCurrentUserSubscription() {
  return await apiClient.get<CurrentSubscription | null>(
    'users/current_user/billing_subscription',
    { appId: configRepo.get().id },
    true,
  );
}
