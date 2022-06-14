git filter-repo --path-glob '*/*.local.js' --invert-paths --force
git filter-repo --path-glob '*/*.sonic.js' --invert-paths --force
git filter-repo --path-glob '*/*.default.js' --invert-paths --force
git filter-repo --path-glob '*/*.lima.js' --invert-paths --force
git filter-repo --path-glob '*/*.zigzag.js' --invert-paths --force
git filter-repo --path-glob '*.npmrc' --invert-paths --force
git filter-repo --path-glob '.npmrc' --invert-paths --force
git filter-repo --path-glob vite.proxy.ts --invert-paths --force
git filter-repo --path-glob .gitlab-ci.yml --invert-paths --force
git filter-repo --path-glob '*/is-api-working.js' --invert-paths --force
git filter-repo --path-glob 'ansible/deploy.yml' --invert-paths --force
git filter-repo --path-glob '*/setupTemporaryMocking.ts' --invert-paths --force
git apply open_source_migration.patch