export const permissionStatuses = {
  promptNeeded: 'promptNeeded',
  granted: 'granted',
  denied: 'denied',
} as const;

export const permissionStrategy = {
  resolveAll: 'resolveAll',
  rejectAll: 'rejectAll',
  prompt: 'prompt',
} as const;
