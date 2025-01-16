// Base patterns
const FILE_EXTS = '(?:js|mjs|cjs|jsx|ts|mts|cts|tsx)';
const CONFIG_EXTS = '(?:json|config)';

// Test patterns
const TEST_FILES = `[.](?:spec|test|fixture)[.]${FILE_EXTS}$`;
const TEST_FOLDERS = '(?:^|/)(?:tests|__tests__|mocks|__mocks__|fixtures|__fixtures__)/';
const TEST_UTILS = '(?:^|/)_.*(?:Tests|Mock|Fixture)(?:Context|Config|Factory)?';

// Config patterns
const DOT_FILES = `(^|/)\\.[^/]+\\.(${FILE_EXTS}|${CONFIG_EXTS})$`;
const TS_CONFIG = '(^|/)tsconfig\\.json$';
const BUILD_CONFIG = `(^|/)(babel|webpack)\\.config\\.(${FILE_EXTS}|${CONFIG_EXTS})$`;

// Type patterns
const TS_DECLARATION = '\\.d\\.ts$';
const TYPE_FILES = '^(.+?)/types.ts$';
const TYPE_FOLDERS = '^(.+?)\\/types\\/([\\w]+\\.ts)$';

// Deprecated core modules
const DEPRECATED_CORE_MODULES = [
  '^v8/tools/codemap$',
  '^v8/tools/consarray$',
  '^v8/tools/csvparser$',
  '^v8/tools/logreader$',
  '^v8/tools/profile_view$',
  '^v8/tools/profile$',
  '^v8/tools/SourceMap$',
  '^v8/tools/splaytree$',
  '^v8/tools/tickprocessor-driver$',
  '^v8/tools/tickprocessor$',
  '^node-inspect/lib/_inspect$',
  '^node-inspect/lib/internal/inspect_client$',
  '^node-inspect/lib/internal/inspect_repl$',
  '^async_hooks$',
  '^punycode$',
  '^domain$',
  '^constants$',
  '^sys$',
  '^_linklist$',
  '^_stream_wrap$'
];

// Combined patterns for rules
const ALL_TEST_PATTERNS = [TEST_FILES, TEST_FOLDERS, TEST_UTILS];
const ALL_CONFIG_PATTERNS = [DOT_FILES, TS_CONFIG, BUILD_CONFIG];
const ALL_TYPE_PATTERNS = [TS_DECLARATION, TYPE_FILES, TYPE_FOLDERS];

const ORPHAN_EXCLUDES = [...ALL_CONFIG_PATTERNS, ...ALL_TYPE_PATTERNS];
const DEV_DEP_EXCLUDES = [...ALL_TEST_PATTERNS, 'node_modules/@types/'];

// Graph visualization settings
const COLLAPSE_PATTERNS = {
  NODE_MODULES: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)',
  HIGH_LEVEL: '^(?:packages|src|lib(s?)|app(s?)|bin|test(s?)|spec(s?))/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)'
};

module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'This dependency is part of a circular relationship.',
      from: {},
      to: { circular: true }
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'This is an orphan module - it\'s likely not used (anymore?).',
      from: {
        orphan: true,
        pathNot: ORPHAN_EXCLUDES
      },
      to: {}
    },
    {
      name: 'no-deprecated-core',
      severity: 'warn',
      comment: 'A module depends on a node core module that has been deprecated.',
      from: {},
      to: {
        dependencyTypes: ['core'],
        path: DEPRECATED_CORE_MODULES
      }
    },
    {
      name: 'not-to-deprecated',
      severity: 'warn',
      comment: 'This module uses a (version of an) npm module that has been deprecated.',
      from: {},
      to: { dependencyTypes: ['deprecated'] }
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      comment: "This module depends on an npm package that isn't in the 'dependencies' section of your package.json.",
      from: {},
      to: { dependencyTypes: ['npm-no-pkg', 'npm-unknown'] }
    },
    {
      name: 'not-to-unresolvable',
      severity: 'error',
      comment: "This module depends on a module that cannot be found ('resolved to disk').",
      from: {
        pathNot: ['src/core/localization/TranslationService.ts']
      },
      to: { couldNotResolve: true }
    },
    {
      name: 'no-duplicate-dep-types',
      severity: 'warn',
      comment: 'Likely this module depends on an external package that occurs more than once in your package.json',
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ['type-only']
      }
    },
    {
      name: 'not-to-spec',
      severity: 'error',
      comment: 'This module depends on a spec (test) file.',
      from: {},
      to: { path: TEST_FILES }
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment: "This module depends on an npm package from the 'devDependencies' section.",
      from: {
        path: '^(src)',
        pathNot: DEV_DEP_EXCLUDES
      },
      to: {
        dependencyTypes: ['npm-dev'],
        dependencyTypesNot: ['type-only'],
        pathNot: ['node_modules/@types/']
      }
    }
  ],
  options: {
    doNotFollow: {
      path: ['node_modules']
    },
    tsConfig: {
      fileName: 'tsconfig.json'
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      mainFields: ['module', 'main', 'types', 'typings']
    },
    reporterOptions: {
      dot: {
        collapsePattern: COLLAPSE_PATTERNS.NODE_MODULES
      },
      archi: {
        collapsePattern: COLLAPSE_PATTERNS.HIGH_LEVEL
      },
      text: {
        highlightFocused: true
      }
    }
  }
};
// generated: dependency-cruiser@16.8.0 on 2024-12-25T15:49:17.492Z
