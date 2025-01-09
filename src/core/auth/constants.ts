export const LOCALSTORAGE_AUTH_KEY = 'auth_token';
export const TIME_TO_REFRESH_MS = 1000 * 60 * 3;

export const AUTH_EVENT_TYPE = {
  SESSION_ENDED: 'session_ended',
  SESSION_STARTED: 'session_started',
  SESSION_REFRESH: 'session_refresh',
  AUTH_ERROR: 'auth_error',
} as const;

export type AuthEventType = (typeof AUTH_EVENT_TYPE)[keyof typeof AUTH_EVENT_TYPE];

export const SESSION_STATE = {
  NO_SESSION: 'NO_SESSION',
  VALID: 'VALID',
  EXPIRED: 'EXPIRED',
  REFRESH_NEEDED: 'REFRESH_NEEDED',
  ERROR: 'ERROR',
} as const;

export type SessionState = (typeof SESSION_STATE)[keyof typeof SESSION_STATE];

export const AUTH_REQUIREMENT = {
  MUST: 'must',
  SHOULD: 'should',
  OPTIONAL: 'optional',
} as const;

export type AuthRequirement = (typeof AUTH_REQUIREMENT)[keyof typeof AUTH_REQUIREMENT];
