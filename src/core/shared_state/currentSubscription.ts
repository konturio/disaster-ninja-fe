import { reatomResource, withCache, withDataAtom } from '@reatom/framework';
import { getCurrentUserSubscription } from '~core/api/subscription';

export const currentUserSubscriptionResource = reatomResource(async () => {
  return await getCurrentUserSubscription();
}, 'currentUserSubscriptionResource').pipe(withDataAtom(), withCache());
