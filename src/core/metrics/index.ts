import { AppMetrics } from './app-metrics';
import { addAllSequences } from './sequences';

export const appMetrics = new AppMetrics();
addAllSequences(appMetrics);
