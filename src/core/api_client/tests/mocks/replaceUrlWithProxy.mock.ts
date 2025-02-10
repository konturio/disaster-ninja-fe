import { vi } from 'vitest';

export const replaceUrlWithProxyMock = vi.fn((url: string) => url);

vi.mock('~utils/axios/replaceUrlWithProxy', () => ({
  replaceUrlWithProxy: replaceUrlWithProxyMock,
}));
