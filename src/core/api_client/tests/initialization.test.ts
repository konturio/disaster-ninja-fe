/**
 * @vitest-environment happy-dom
 */
import { test, expect } from 'vitest';
import './_configMock';
import { ApiClient } from '../apiClient';
import {
  createNotificationServiceMock,
  createTranslationServiceMock,
} from './_servicesMocks';

/* Test cases */

test('has to be initialized first', () => {
  expect(ApiClient.getInstance).toThrowError(
    'You have to initialize api client first!',
  );
});

test('can be initialized with config object', () => {
  ApiClient.init({
    notificationService: createNotificationServiceMock(),
    translationService: createTranslationServiceMock(),
    loginApiPath: '/login',
    baseURL: 'https://localhost/api',
    timeout: 3000,
  });
  expect(ApiClient.getInstance()).toBeTruthy();
});
