// don't install husky with CI
const isCi = process.env.CI !== undefined;
if (!isCi) {
  import('husky').then((hs) => hs.install());
}
