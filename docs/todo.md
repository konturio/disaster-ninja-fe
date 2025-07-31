- Vitest tests fail with "Fatal JavaScript invalid size error" when running the full suite.
  Investigate memory usage or environment mismatch to restore test execution.
- Even with pnpm@9 installed, 'pnpm test:unit' crashes with 'Fatal JavaScript invalid size error 169220804'. LRUCache max is small so the bug might stem from Node/V8; needs further investigation.
