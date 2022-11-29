import { AppMetrics } from './app-metrics';
import { addAllSequences } from './sequences';

export const appMetrics = AppMetrics.getInstance();
addAllSequences(appMetrics);
