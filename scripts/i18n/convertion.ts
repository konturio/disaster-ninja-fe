import path from 'path';
import minimist from 'minimist';
import { readFileSync, existsSync } from 'fs';
import { i18nextToPo, gettextToI18next, i18nextToPot } from 'i18next-conv';
import { getDirectories } from './utils/getDirectories';
import { save } from './utils/save';
import { withBase } from './utils/withBase';

const args = minimist<{ 'to-gettext': boolean; 'to-i18next': boolean }>(
  process.argv.slice(2),
);
// filter option from https://github.com/i18next/i18next-gettext-converter#usage
// we need this because multiple references in one line is not supported by gettext-parser https://github.com/smhg/gettext-parser/issues/29
function referenceMultilineFormatter(gt, locale: string, callback, domain = 'messages') {
  const translations = gt.catalogs[locale][domain].translations;
  gt.setLocale(locale);
  // replace all spaces with \n
  // layers bivariate##color_manager##layers_filter -> layers\nbivariate##color_manager##layers_filter
  Object.keys(translations).forEach((ctx) => {
    Object.keys(translations[ctx]).forEach((key) => {
      const comment = gt.getComment('messages', ctx, key);
      if (comment && comment.reference && comment.reference.includes(' ')) {
        comment.reference = comment.reference.replace(' ', '\n');
      }
    });
  });

  callback(null, translations);
}

function selectTargetFolder(
  dirs: Record<string, string>,
  args: Record<'to-gettext' | 'to-i18next', boolean>,
): string {
  switch (true) {
    case args['to-gettext']:
      return dirs.i18n;

    case args['to-i18next']:
      return dirs.gettext;

    default:
      throw Error('Can not set target folder. Set `--to-gettext` or `--to-i18next` flag');
  }
}

async function conversion() {
  const dirs = withBase({
    base: path.dirname(path.resolve('package.json')),
    i18n: './src/core/localization/translations',
    gettext: './src/core/localization/gettext',
    pot: './src/core/localization/gettext/template/common.pot',
  });

  const getI18nbyLang = (lang: string) => path.join(dirs.i18n, lang, 'common.json');
  const getPobyLang = (lang: string) => path.join(dirs.gettext, lang, 'common.po');
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

  const sourceLanguagesFolder = selectTargetFolder(dirs, args);

  const allLanguages = getDirectories(sourceLanguagesFolder).filter(
    (lang) => !['en', 'template'].includes(lang),
  ); // we don't need en .po files as translation is already a key + ignore template folder
  console.info(allLanguages, ' languages detected...');

  return Promise.all([
    // here we generate .pot file from src/core/localization/translations/en/common-messages.json
    // as developers modify only this file
    args.toGettext
      ? i18nextToPot('en', readFileSync(getI18nbyLang('en')), potOptions).then(
          save(dirs.pot),
        )
      : null,

    ...allLanguages.map((lang) => {
      const [i18nFile, poFile] = [getI18nbyLang(lang), getPobyLang(lang)];
      if (args.toGettext) {
        // here we generate .po files for all locales (excluding en) only if they are missing
        if (!existsSync(getPobyLang(lang))) {
          return i18nextToPo(lang, readFileSync(i18nFile), {
            ...poOptions,
            language: lang,
          }).then(save(poFile)); // if import/export new language it will create a destination folder automatically
        }
      } else if (args.toi18next) {
        // here we convert .po files to i18next for every locale
        // really we need to perform it only first time to get .po files from our existing i18next files
        // if you want to regenerate .po files, you need to have i18n files
        return gettextToI18next(lang, readFileSync(poFile), {
          ...poOptions,
          filter: (gt, locale, callback) =>
            referenceMultilineFormatter(gt, locale, callback),
        }).then(save(i18nFile));
      }
    }),
  ]);
}

try {
  await conversion();
  console.info('convertion done!');
} catch (e) {
  console.error('convertion failed: ', e);
}
