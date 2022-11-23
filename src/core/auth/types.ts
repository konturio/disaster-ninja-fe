import type { UserStateStatus } from './constants';

export type UserStateType = typeof UserStateStatus[keyof typeof UserStateStatus];
