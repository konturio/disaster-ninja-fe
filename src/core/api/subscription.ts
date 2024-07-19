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
  const appId = configRepo.get().id;
  return await apiClient.post<CurrentSubscription | null>(
    `/users/current_user/billing_subscription`,
    { appId, billingPlanId, billingSubscriptionId },
    true,
  );
}
