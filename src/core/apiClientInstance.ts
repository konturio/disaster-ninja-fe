import { goTo } from '~core/router/goTo';
import { withSetupCheck } from '~utils/common/withSetupCheck';
import { ApiClient } from './api_client';
import { notificationServiceInstance } from './notificationServiceInstance';

export const apiClient = withSetupCheck(ApiClient, {
  on: {
    error: (error) => {
      switch (error.problem.kind) {
        case 'unauthorized':
        case 'forbidden':
          alert('Access denied or your session expired. Please login again');
          goTo('/profile');
          location.reload();
          break;

        default:
          notificationServiceInstance.error({
            title: 'Error',
            description: error.message,
          });
      }
    },
  },
});

export const reportsClient = withSetupCheck(ApiClient, {
  on: {
    error: (error) => {
      switch (error.problem.kind) {
        default:
          notificationServiceInstance.error({
            title: 'Error',
            description: error.message,
          });
      }
    },
  },
});
