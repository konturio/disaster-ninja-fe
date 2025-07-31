# Disabled E2E tests

Some Playwright tests are temporarily disabled using `test.fixme`. All such cases must be recorded in `TEST_FIXMES.md`.

## Updating registry

When adding or removing a `test.fixme` call, update `TEST_FIXMES.md` with the file, line number, related issue and date. CI will fail if the registry is not in sync.

Run `pnpm run check:fixmes` locally to verify.
