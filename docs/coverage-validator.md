# External library call coverage validator

This project includes a custom validator that checks test coverage for all calls to external libraries.

Run it manually with:

```bash
pnpm validate:external-calls
```

It analyses the coverage report produced by `pnpm coverage` and fails if any line invoking an external dependency is not covered by tests. The validator reports the library and symbol used. If some calls to the same symbol are covered elsewhere, missing lines are reported as warnings.

If the coverage file is missing or outdated the validator will automatically run `pnpm coverage` before analysing. Pass `--no-run` to skip running tests and only analyse existing coverage data.

The validator is executed automatically on `pre-commit`.
