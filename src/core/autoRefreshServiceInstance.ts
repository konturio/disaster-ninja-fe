import { appConfig } from '~core/app_config';
import { autoRefreshService } from './auto_refresh';

autoRefreshService.start(appConfig.refreshIntervalSec);

export { autoRefreshService } from './auto_refresh';
