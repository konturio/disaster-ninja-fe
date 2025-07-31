- Vitest used to crash with "Fatal JavaScript invalid size error" when walking the LRU cache.
  Upgrading lru-cache to >=11.2 is recommended when available. The cache iteration
  now avoids mutations, so tests pass under Node 20.19.4.
