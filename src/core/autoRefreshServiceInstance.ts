import config from './app_config';
import { autoRefreshService } from './auto_refresh';

autoRefreshService.start(config.refreshIntervalSec);

export { autoRefreshService } from './auto_refresh';
