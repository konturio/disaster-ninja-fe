import { apiClient } from '~core/apiClientInstance';
import { configRepo } from '~core/config';

export type CurrentSubscription = {
  id: string;
  billingPlanId: string;
  billingSubscriptionId: string;
};

export async function getCurrentUserSubscription() {
  return await apiClient.get<CurrentSubscription | null>(
    '/users/current_user/billing_subscription',
    { appId: configRepo.get().id },
    true,
  );
}

export async function setCurrentUserSubscription(
  billingPlanId: string,
  billingSubscriptionId: string,
) {
  // TODO: we need to use application/json, not search parameters! Need BE changes
  const appId = configRepo.get().id;
  return await apiClient.post(
    `/users/current_user/billing_subscription?appId=${appId}&billingPlanId=${billingPlanId}&billingSubscriptionId=${billingSubscriptionId}`,
    undefined,
    true,
  );
}
