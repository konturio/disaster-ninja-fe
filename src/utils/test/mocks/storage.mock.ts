import { FallbackStorage } from '~utils/storage';

/**
 * Mock implementation of the Web Storage API
 * Reuses the FallbackStorage implementation from the main codebase
 */
export class StorageMock extends FallbackStorage {
  constructor() {
    super();
  }
}
