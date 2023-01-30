import path from 'path';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { i18nextToPo, gettextToI18next, i18nextToPot } from 'i18next-conv';

const toGettext = '--to-gettext';
const toi18next = '--to-i18next';

const save = (target) => (result) => {
  // if import/export new language it will create a destination folder automatically
  const targetFolder = path.dirname(target);
  if (!existsSync(targetFolder)) mkdirSync(targetFolder);

  writeFileSync(target, result);
};

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

// filter option from https://github.com/i18next/i18next-gettext-converter#usage
// we need this because multiple references in one line is not supported by gettext-parser https://github.com/smhg/gettext-parser/issues/29
const referenceMultilineFormatter = function (gt, locale, callback) {
  const domain = 'messages';
  const translations = gt.catalogs[locale][domain].translations;
  gt.setLocale(locale);
  // replace all spaces with \n
  // layers bivariate##color_manager##layers_filter -> layers\nbivariate##color_manager##layers_filter
  Object.keys(translations).forEach((ctxt) => {
    Object.keys(translations[ctxt]).forEach((key) => {
      const comment = gt.getComment('messages', ctxt, key);
      if (comment && comment.reference && comment.reference.includes(' ')) {
        comment.reference = comment.reference.replace(' ', '\n');
      }
    });
  });

  callback(null, translations);
};

const convertion = async () => {
  const arg = process.argv.slice(2)?.[0];
  if (!arg || ![toGettext, toi18next].includes(arg)) {
    console.error(`Specify a flag please, it's ${toGettext} or ${toi18next}.`);
    return;
  }

  const projectRoot = path.dirname(path.resolve('package.json'));
  const localizationFolder = path.join(projectRoot, './src/core/localization');
  const i18nFolder = path.join(localizationFolder, 'translations');
  const gettextFolder = path.join(localizationFolder, 'gettext');
  const getI18nbyLang = (lang) => path.join(i18nFolder, lang, 'common.json');
  const getPobyLang = (lang) => path.join(gettextFolder, lang, 'common.po');
  const potFile = path.join(gettextFolder, 'template', 'common.pot');
  const potOptions = {
    compatibilityJSON: 'v4',
    ctxSeparator: ':',
    keyasareference: true,
    skipUntranslated: true,
    noDate: true, // as we don't need POT-Creation-Date and PO-Revision-Date
  };

  const poOptions = {
    ...potOptions,
    base: readFileSync(getI18nbyLang('en')),
    language: 'en',
  };

  const sourceLanguagesFolder =
    arg === toGettext ? i18nFolder : arg === toi18next ? gettextFolder : null;
  const allLanguages = getDirectories(sourceLanguagesFolder).filter(
    (lang) => !['en', 'template'].includes(lang),
  ); // we don't need en .po files as translation is already a key + ignore template folder
  console.info(allLanguages, ' languages detected...');

  return Promise.all([
    // here we generate .pot file from src/core/localization/translations/en/common-messages.json
    // as developers modify only this file
    arg === toGettext
      ? i18nextToPot('en', readFileSync(getI18nbyLang('en')), potOptions).then(
          save(potFile),
        )
      : null,

    ...allLanguages.map((lang) => {
      const [i18nFile, poFile] = [getI18nbyLang(lang), getPobyLang(lang)];
      if (arg === toGettext) {
        // here we generate .po files for all locales (excluding en) only if they are missing
        if (!existsSync(getPobyLang(lang))) {
          return i18nextToPo(lang, readFileSync(i18nFile), {
            ...poOptions,
            language: lang,
          }).then(save(poFile));
        }
      } else if (arg === toi18next) {
        // here we convert .po files to i18next for every locale
        // really we need to perform it only first time to get .po files from our existing i18next files
        // if you want to regenerate .po files, you need to have i18n files
        return gettextToI18next(lang, readFileSync(poFile), {
          ...poOptions,
          filter: referenceMultilineFormatter,
        }).then(save(i18nFile));
      }
    }),
  ]);
};

try {
  await convertion();
  console.info('convertion done!');
} catch (e) {
  console.error('convertion failed: ', e);
}