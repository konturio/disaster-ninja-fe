# Disaster Ninja 2.0

[![codecov](https://codecov.io/github/konturio/disaster-ninja-fe/branch/main/graph/badge.svg?token=ZGBNM8GA5A)](https://codecov.io/github/konturio/disaster-ninja-fe)

Disaster Ninja is a tool specifically designed for humanitarian mappers. It is complete critical event management solution that visualizes mapping gaps, provides information about recent natural disasters, and helps connect with local mappers for ground truth verification.

Improving and updating OpenStreetMap data has proven to be an effective way to help international response efforts when disasters strike. An active contributor to the OpenStreetMap community, Kontur partnered with [the Humanitarian OpenStreetMap Team (HOT)](https://www.hotosm.org/) to create a tool to support the rapid deployment of emergency mapping campaigns.

The initial purpose of Disaster Ninja was to gather all necessary data to automate the Disaster Size-Up preparation by HOT, provide instant mapping insights, and free up time to maximize the efficiency of volunteer mappers’ work.

The tool’s functionality is much broader nowadays: it can be used whenever insights from correlating OpenStreetMap data and population density might be helpful. Users can also get analytics for areas affected by disasters, freehand polygons, administrative boundaries, add their own layers, and much more.

[More info ==>](https://www.kontur.io/portfolio/disaster-ninja/)

Run `npx husky-init` after you first time clone project

## How to use

The easiest way to use disaster-ninja front-end build is to use a docker image.
```
docker run --rm -d -p 80:80/tcp ghcr.io/konturio/disaster-ninja-fe:latest
```
after that it will be available on `http://localhost/active/` url

Another way is - use vite preview build
```
npm i
npm run build
npm run serve
```

## How to develop

For start dev server all you need is
```
npm i
npm run dev
```

## How to i18n

We use 18next + gettext convertion approach in our development toolchain.
There are several tasks in package.json:
- i18n:export converts i18next to gettext
- i18n:import converts gettext to i18next
- i18n:update extracts new translation keys from code to common.json (i18n.t, <Trans/>) and removes unused keys.
- lint:i18n:keys:identity is needed to see untranslated keys for all locales (make sure you ran i18n:import before, it compares i18n files)
But you don't need to manually run all of them.
As a developer you only need to interact with i18next en file by i18n:update command. (`src/core/localization/translations/en/common.json`)
So whenever you add new key in your code - run i18n:update, you'll see common.json updated.
Then fill the translation, it's obligatory by our eslint rules.
It will be converted to .pot file on pre-commit hook and added to commit.
Later translators will add new translations to .po files comparing them with .pot file.
When you run or build a project .po files convert to i18next .json files, so new translations become available on frontend.

## Available Scripts

### npm start

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm test

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

### npm run build

Builds a static copy of your site to the `dist/` folder.

### npm run serve
Run static server for builded app

### typecheck and typecheck:watch
Check types error in project

### postinstall
Run this script after you run npm install
This will fix deck-gl types

### upgrade:kontur
Update @konturio to last versions

## Configuration
This app have few source of configuration:

**Buildtime env variables**
Need for store data that used in build time. This mostly internal glue stuff as env 'production' / 'development' variables, describe variables that rule build process (special build modes, hot reload, minification, mocks, etc.). Avoid to use it in src/* files.
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
- How to read: `import appConfig from '~core/app_config'`

> If you want use some build time variables in browser - re-export them from app_config
