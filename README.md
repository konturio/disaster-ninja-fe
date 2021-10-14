# New Project

> ✨ Bootstrapped with Create Snowpack App (CSA).

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

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

## Configuration
This app have few source of configuration:
- Buildtime env variables
This mostly internal glue stuff as env 'production' / 'development' variables.
Must describe variables that rule build process (special build modes, hot reload, minification, mocks, etc.)
More info: https://vitejs.dev/guide/env-and-mode.html#env-files

- Runtime variables
different for every environment, describe global app variables.
Must describe - api endpoints, feature flags, base url, path to s3 with images, etc.)
Available via AppConfig alias, in runtime in browser environment
They defined in JSON-per-enviroment files in `./deploy/` folder.
In CI/CD, before bundled app will be deployed in environment, ansible take json for environment ~~and inject this right into index.html of app using script for qjs~~
and put in static server with index.html of app