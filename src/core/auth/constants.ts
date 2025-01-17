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

/**
 * Authentication requirement levels for API endpoints
 * @property {string} MUST - Authentication is required. Requests will fail if user is not authenticated
 * @property {string} OPTIONAL - Authentication is preferred but not mandatory. Will attempt to use auth if available, proceed without if not
 * @property {string} NEVER - Authentication must not be included. Requests will fail if auth token is present
 */
export const AUTH_REQUIREMENT = {
  MUST: 'must', // Strict requirement
  OPTIONAL: 'optional', // Use auth if available, proceed without if not
  NEVER: 'never', // Explicitly prevent auth
} as const;

export type AuthRequirement = (typeof AUTH_REQUIREMENT)[keyof typeof AUTH_REQUIREMENT];
