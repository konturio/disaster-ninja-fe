import { apiClient } from '~core/apiClientInstance';
import type { CurrentSubscriptionInfo } from '~features/subscriptions/types';

export async function getCurrentUserSubscription() {
  try {
    return await apiClient.get<CurrentSubscriptionInfo>(
      '/current_user/subscription ',
      undefined,
      true,
    );
  } catch (error) {
    return null;
  }
}
