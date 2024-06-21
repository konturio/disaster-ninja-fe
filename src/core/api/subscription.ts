import { apiClient } from '~core/apiClientInstance';
import type { CurrentSubscription } from '~features/subscriptions/types';

export async function getCurrentUserSubscription() {
  try {
    return await apiClient.get<CurrentSubscription>(
      '/current_user/billing_subscription',
      undefined,
      true,
    );
  } catch (error) {
    return null;
  }
}
