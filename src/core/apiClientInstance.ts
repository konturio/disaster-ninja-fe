import { ApiClient } from './api_client';
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
  },
});
