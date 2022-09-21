/**
 * @vitest-environment happy-dom
 */
import { test, expect, beforeEach } from 'vitest';
import sinon from 'sinon';
import { ApiClientError } from '../apiClientError';
import { createContext } from './_clientTestsContext';

beforeEach((context) => {
  context.ctx = createContext();
});
