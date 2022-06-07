import { AuthClient } from './auth/client/AuthClient';
import { apiClient } from './apiClientInstance';

AuthClient.init({ apiClient });
export const authClientInstance = AuthClient.getInstance();
