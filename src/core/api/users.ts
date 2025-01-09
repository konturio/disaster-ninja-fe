import { apiClient } from '~core/apiClientInstance';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import type { UserDto } from '~core/app/user';

export function getCurrentUser() {
  return apiClient.get<UserDto>('/users/current_user', undefined, {
    authRequirement: AUTH_REQUIREMENT.MUST,
  });
}

export function updateCurrentUser(user: UserDto) {
  return apiClient.put<UserDto>('/users/current_user', user, {
    authRequirement: AUTH_REQUIREMENT.MUST,
  });
}
