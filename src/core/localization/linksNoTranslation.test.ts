import fs from 'fs';
import { describe, expect, it, test } from 'vitest';
import gettextParser from 'gettext-parser';
import { extractLinkAndLabels } from './extractLinkAndLabelFromMarkdown';
import type { LinkAndLabel } from './extractLinkAndLabelFromMarkdown';

const languageCodes = ['ar', 'de', 'es', 'id', 'ko', 'uk'];

type GettextTranslation = {
  msgid: string;
  msgstr: string[];
};

type GettextTranslations = {
  [key: string]: GettextTranslation;
};

const checkLinksAndLabels = function (
  engArray: LinkAndLabel[],
  translatedArray: LinkAndLabel[],
) {
  engArray.forEach((engLinkAndLabel: LinkAndLabel, index) => {
    const translatedLinkAndLabel: LinkAndLabel = translatedArray[index];
    // If eng version text with link is present and text in translated version is present, verify that translated version has text with link under the same number and generally has text with link.
    expect(translatedLinkAndLabel).toBeTruthy();

    // Assert values are present inside links and texts
    expect(engLinkAndLabel.link).toBeTruthy();
    expect(engLinkAndLabel.label).toBeTruthy();
    expect(translatedLinkAndLabel.link).toBeTruthy();
    expect(translatedLinkAndLabel.label).toBeTruthy();

    // Assert links are not translated
    expect(translatedLinkAndLabel.link).toEqual(engLinkAndLabel.link);

    translatedArray.forEach((_, index) => {
      const engLinkAndLabel = engArray[index];
      // If translated version text with link is present, english version for it should also be present
      expect(engLinkAndLabel).toBeTruthy();
    });
  });
};

const compareLinksTest = (languageCode: string) => {
  const poFileContent = fs.readFileSync(
    `src/core/localization/gettext/${languageCode}/common.po`,
  );

  const poDataFull = gettextParser.po.parse(poFileContent);
  const poData = poDataFull.translations[''] as GettextTranslations;

  for (const [reference, info] of Object.entries(poData) as [
    string,
    GettextTranslation,
  ][]) {
    // exclude "" key
    if (reference) {
      const engVersion = info.msgid;
      const translatedVersion = info.msgstr[0];

      const engVersionLinksArr = extractLinkAndLabels(engVersion);
      const translatedVersionLinksArr = extractLinkAndLabels(translatedVersion);

      if (translatedVersion) {
        checkLinksAndLabels(engVersionLinksArr, translatedVersionLinksArr);
      }
    }
  }
};

describe('Links in localized texts', () => {
  describe('Links are untranslated, have corresponding label, and are properly defined in links and labels of translations', () => {
    languageCodes.forEach((code) => {
      it(`Check links and labels of ${code.toUpperCase()} locale`, () => {
        compareLinksTest(code);
      });
    });
  });
});
