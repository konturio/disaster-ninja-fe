import { describe, expect, it, test } from 'vitest';
import gettextParser from 'gettext-parser';
import fs from 'fs';

// Here the input data for the test is specified
const languageCodes = ['ar', 'de', 'es', 'id', 'ko', 'uk'];

const processLinkAndText = (linkAndText) => {
  const devidedArrLinkAndText = linkAndText.split(']');
  const textOfLink = devidedArrLinkAndText[0].replace('[', '');
  const link = devidedArrLinkAndText[1].slice(1, devidedArrLinkAndText[1].length - 1);
  const result = {
    link: link,
    text: textOfLink,
  };
  return result;
};

// Here is the test itself
const compareLinksTest = (languageCode: string) => {
  // First reading data from file
  const poFileContent = fs.readFileSync(
    `src/core/localization/gettext/${languageCode}/common.po`,
  );
  // Using parser to parse data
  const poData = gettextParser.po.parse(poFileContent).translations[''];
  // Looping over converted object to array
  for (const [reference, info] of Object.entries(poData)) {
    // exclude "" key
    if (reference) {
      // Match [sometext](sometext)
      const regularExpToFind = /\[.*?\]\(.*?\)/g;
      const engVersion = info.msgid;
      const translatedVersion = info.msgstr[0];

      const engVersionLinksArr = engVersion.match(regularExpToFind);
      const translatedVersionLinksArr = translatedVersion.match(regularExpToFind);

      if (translatedVersion) {
        // match() returns an array, looping it over considering that undefined might be as input if no links are present
        engVersionLinksArr?.forEach((engTextAndLinkText, index) => {
          const translatedTextAndLinkText = translatedVersionLinksArr?.[index];

          // if eng version text with link is present and text in translated version is present, verify that translated version has text with link under the same number and generally has text with link.
          expect(translatedTextAndLinkText).toBeTruthy();

          const extractedTextAndLink = processLinkAndText(engTextAndLinkText);
          const extractedTranslatedTextAndLink = processLinkAndText(
            translatedTextAndLinkText,
          );

          // Assert values are present inside links and texts
          expect(extractedTextAndLink.link).toBeTruthy();
          expect(extractedTextAndLink.text).toBeTruthy();
          expect(extractedTranslatedTextAndLink.link).toBeTruthy();
          expect(extractedTranslatedTextAndLink.text).toBeTruthy();

          // Assert links are not translated
          expect(extractedTranslatedTextAndLink.link).toEqual(extractedTextAndLink.link);

          // Assert texts in the link are translated
          expect(extractedTranslatedTextAndLink.text).not.toEqual(
            extractedTextAndLink.text,
          );
        });
        translatedVersionLinksArr?.forEach((translatedTextAndLink, index) => {
          const engTextAndLink = engVersionLinksArr?.[index];
          // if translated version text with link is present, english version for it should also be present
          expect(engTextAndLink).toBeTruthy();
        });
      }
    }
  }
};

// Building vitest test
describe('Localisation links', () => {
  describe('Translated links are the same as original ones, but texts are different', () => {
    languageCodes.forEach((code) => {
      it(`Links are the same for ${code}, but texts are different`, () => {
        compareLinksTest(code);
      });
    });
  });
});
