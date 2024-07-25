import { apiClient } from '~core/apiClientInstance';
import type { UserDto } from '~core/app/user';

export function getReport() {
  return apiClient.get<UserDto>('/users/current_user', undefined, true, {
    // errorsConfig: { messages: '' },
  });
}

export function getReports() {
  return apiClient.get<UserDto>('/users/current_user', undefined, true, {
    // errorsConfig: { messages: '' },
  });
}

//   reportsClient.setup({  baseUrl: stageConfig.reportsApiGateway,});
