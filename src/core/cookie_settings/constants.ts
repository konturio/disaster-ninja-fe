export const permissionStatuses = {
  promptNeeded: 'promptNeeded',
  granted: 'granted',
  denied: 'denied',
} as const;

export const permissionStrategy = {
  applyAll: 'applyAll',
  rejectAll: 'rejectAll',
  prompt: 'prompt',
} as const;
