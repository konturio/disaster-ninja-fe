# Disaster Ninja 2.0

[![codecov](https://codecov.io/github/konturio/disaster-ninja-fe/branch/main/graph/badge.svg?token=ZGBNM8GA5A)](https://codecov.io/github/konturio/disaster-ninja-fe)

Disaster Ninja is a tool specifically designed for humanitarian mappers. It is complete critical event management solution that visualizes mapping gaps, provides information about recent natural disasters, and helps connect with local mappers for ground truth verification.

Improving and updating OpenStreetMap data has proven to be an effective way to help international response efforts when disasters strike. An active contributor to the OpenStreetMap community, Kontur partnered with [the Humanitarian OpenStreetMap Team (HOT)](https://www.hotosm.org/) to create a tool to support the rapid deployment of emergency mapping campaigns.

The initial purpose of Disaster Ninja was to gather all necessary data to automate the Disaster Size-Up preparation by HOT, provide instant mapping insights, and free up time to maximize the efficiency of volunteer mappers’ work.

The tool’s functionality is much broader nowadays: it can be used whenever insights from correlating OpenStreetMap data and population density might be helpful. Users can also get analytics for areas affected by disasters, freehand polygons, administrative boundaries, add their own layers, and much more.

[More info ==>](https://www.kontur.io/portfolio/disaster-ninja/)

📖 [AI-generated tutorial](docs/toc.md)


Run `npx husky-init` after you first time clone project

## How to use

The easiest way to use disaster-ninja front-end build is to use a docker image.

```
docker run --rm -d -p 80:80/tcp ghcr.io/konturio/disaster-ninja-fe:latest
```

after that it will be available on `http://localhost/active/` url

Another way is - use vite preview build

```
pnpm i
pnpm run build
pnpm run serve
```

## How to develop

For start dev server all you need is

```
pnpm i
pnpm run dev
```

React Cosmos dev server available via `pnpm run cosmos`

Chrome browser will try to load local dev server with HSTS policy, which will cause error. To fix it,
open `chrome://net-internals/#hsts`, go to section "Delete domain security policies" and delete policy for `localhost`

## Internationalization (i18n)

### Overview
We use i18next for runtime translations with gettext (.po/.pot) for translation management. This setup allows developers to work with JSON files while providing standard gettext files for translators.

### Available Scripts

- `i18n:export` - Converts i18next JSON to gettext (.po/.pot) format for translators
- `i18n:import` - Converts gettext files back to i18next JSON format (runs automatically on install/build)
- `i18n:update` - Scans codebase for translation keys and updates common.json
- `i18n:gettext-sync` - Synchronizes .po files with the master .pot file
- `i18n:report` - Generates diagnostic report about translation status
- `lint:i18n:keys:identity` - Validates translation key consistency across languages

### Key Format Rules

We use a structured approach for translation keys:
```javascript
{
    "errors": {
        "default": "Sorry, we are having issues, which will be fixed soon",
        "timeout": "Request Timeout",
        "cannot_connect": "Can't connect to server"
    }
}
```

- Format: snake_case ("event_list")
- Nesting separator: "." ("event_list.warning_title")
- Plural separator: ":" ("key:one")
- Context separator: ":" ("friend:male")
- Default namespace: "common" (no need to specify in keys)

### Implementation Guide

1. Import translation functions:
```typescript
import { i18n } from '~core/localization';
// or for components with HTML
import { Trans } from 'react-i18next';
```

2. Use in code:
```typescript
// Simple strings
const message = i18n.t('errors.default');

// With HTML
<Trans i18nKey="about.description">
    Content with <strong>HTML</strong> elements
</Trans>
```

3. After adding new translations:
```bash
pnpm run i18n:update    # Extract new keys
pnpm run i18n:export    # Convert to .pot/.po
```

### Automated Workflows

The following processes are automated:

1. **Pre-commit**:
   - Validates JSON syntax for translation files
   - Automatically exports new translations to .pot
   - Adds generated .pot files to commit

2. **Build Process**:
   - Runs `i18n:import` during:
     - `pnpm install` (postinstall)
     - Development server start
     - Production build
     - Test execution

### Project Configuration

- Single namespace: `common`
- Default language: `en`
- Source files scanned: `.ts` and `.tsx`
- Translation functions: `i18n.t()` and `t()`
- ESLint validation via `i18n-json` plugin

### Translation Workflow

1. Developer adds/modifies translations in code
2. Runs `i18n:update` to extract keys
3. Updates English translations in `src/core/localization/translations/en/common.json`
4. Commits changes (automatically generates .pot)
5. Translators work with .po files
6. After receiving translations:
   - Run `i18n:gettext-sync` to synchronize
   - Run `i18n:import` to convert to JSON

### Common Issues

- **Missing Translations**: Run `lint:i18n:keys:identity` to identify gaps
- **HTML in Translations**: Use `<Trans/>` component with proper indexing
- **Unsynchronized Files**: Run `i18n:gettext-sync` after receiving new translations
- **Runtime Issues**: Ensure `i18n:import` was run before starting the app

## Available Scripts

### pnpm start

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### pnpm test

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

### pnpm run build

Builds a static copy of your site to the `dist/` folder.

### pnpm run serve

Run static server for builded app

### typecheck and typecheck:watch

Check types error in project

### postinstall

Run this script after you run pnpm install

### upgrade:kontur

Update @konturio to last versions

## Configuration

This app have few source of configuration:

**Buildtime env variables**
Need for store data that used in build time. This mostly internal glue stuff as env 'production' / 'development' variables, describe variables that rule build process (special build modes, hot reload, minification, mocks, etc.). Avoid to use it in src/\* files.

- When used: At buildtime (node.js)
- How to set: use [.env](https://vitejs.dev/guide/env-and-mode.html#env-files) files
- How to read: `import.meta.env.VARIABLE_NAME`

**Runtime variables**
Can be different for every environment.
Must describe - api endpoints, feature flags, base url, path to s3 with images, etc.
Available via AppConfig alias, in runtime in browser environment
They defined in JSON-per-enviroment files in `./configs/` folder.
You can your own for override default config, it should have name `./configs/config.local.json`

- When used: At runtime (browser)
- How to set: by configs in `./configs/`
- How to read: `import { configRepo } from '~core/config';`

> If you want use some build time variables in browser - re-export them from app_config

## Running e2e tests with Playwright

1. Install Playwright and its browsers

```bash
npx playwright install
```

2. Set up the environment variables

Create a `.env.playwright.local` file in the root of the project with the following content:

```bash
EMAIL=<test-email>
PASSWORD=<test-password>
EMAIL_PRO=<pro-test-email>
PASSWORD_PRO=<pro-test-password>
ENVIRONMENT=<env>
APP_NAME=all
ADMIN_KEYCLOAK=<keycloak-login>
ADMIN_KEYCLOAK_PASSWORD=<keycloak-password>
SLACK_BOT_USER_OAUTH_TOKEN=token
```

Where <env> is the environment you want to test, for example `test`.

3. Run the e2e tests

```bash
npx playwright test --ui
```

Remove the `--ui` flag to run the tests in a headless mode.
Use the `--headed` flag instead of the `--ui` flag to run the tests in a headed mode.

> Check the `tests-examples/demo-todo-app.spec.ts` file for an example of how to write tests.

## Running Playwright e2e tests on a local environment

1. Run the app in dev mode

Follow the [How to develop](#how-to-develop) section to run the app in dev mode.

To view the app, visit https://localhost:3000 in your browser.

2. Install Playwright and its browsers

```bash
npx playwright install
```

3. Set up the .env.playwright.local file

Create a `.env.playwright.local` file in the root of the project with the following content:

```bash
EMAIL=<test-email>
PASSWORD=<test-password>
EMAIL_PRO=<pro-test-email>
PASSWORD_PRO=<pro-test-password>
ENVIRONMENT=local-<env>
APP_NAME=all
ADMIN_KEYCLOAK=<keycloak-login>
ADMIN_KEYCLOAK_PASSWORD=<keycloak-password>
SLACK_BOT_USER_OAUTH_TOKEN=token
```

Where `<env>` is the environment your local app is configured, for example `local-dev`.

4. Run the e2e tests

```bash
npx playwright test --ui
```

Remove the `--ui` flag to run the tests in a headless mode.
Use the `--headed` flag instead of the `--ui` flag to run the tests in a headed mode.

> Check the `tests-examples/demo-todo-app.spec.ts` file for an example of how to write tests.
