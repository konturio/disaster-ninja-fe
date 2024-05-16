import { configRepo } from '~core/config';
export const isAuthenticated = () => configRepo.get().user?.username;
