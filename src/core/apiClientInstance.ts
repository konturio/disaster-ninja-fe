import { ApiClient } from './api_client';
import { dispatchMetricsEvent } from './metrics/dispatch';
import { notificationServiceInstance } from './notificationServiceInstance';

export const apiClient = new ApiClient({
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
    idle: () => dispatchMetricsEvent('apiClient_isIdle'),
  },
});

export const reportsClient = new ApiClient({
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
    idle: () => dispatchMetricsEvent('reportsClient_isIdle'),
  },
});
