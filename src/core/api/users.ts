import { apiClient } from '~core/apiClientInstance';
import type { UserDto } from '~core/app/user';

export function getCurrentUser() {
  return apiClient.get<UserDto>('/users/current_user', undefined, true, {
    // errorsConfig: { messages: '' },
  });
}

export function updateCurrentUser(user: UserDto) {
  return apiClient.put<UserDto>('/users/current_user', user, true, {
    // errorsConfig: { messages: '' },
  });
}
