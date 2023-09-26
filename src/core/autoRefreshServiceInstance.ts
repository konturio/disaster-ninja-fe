import configRepo from '~core/config';
import { autoRefreshService } from './auto_refresh';

autoRefreshService.start(configRepo.get().refreshIntervalSec);

export { autoRefreshService } from './auto_refresh';
