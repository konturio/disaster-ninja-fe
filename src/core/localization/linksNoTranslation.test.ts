import fs from 'fs';
import { describe, expect, it, test } from 'vitest';
import gettextParser from 'gettext-parser';
import { fromMarkdown } from 'mdast-util-from-markdown';
import type { Link } from 'mdast-util-from-markdown/lib';

const languageCodes = ['ar', 'de', 'es', 'id', 'ko', 'uk'];

type LinkAndLabel = {
  link?: string;
  label?: string;
};

type GettextTranslation = {
  msgid: string;
  msgstr: string[];
};

/**
 * Function for extracting an array of links from a markdown string
 * @param markdownString input markdown string
 * @returns array of { link, label } objects
 */

const extractLinkAndLabels = (markdownString: string): LinkAndLabel[] => {
  const result: LinkAndLabel[] = [];
  const paragraph = fromMarkdown(markdownString).children[0];
  if (paragraph?.type === 'paragraph') {
    const linkChildren: Link[] = paragraph.children.filter(
      (child) => child.type === 'link',
    ) as Link[];
    for (const linkChild of linkChildren) {
      const link = linkChild?.url;
      if (link) {
        const label =
          linkChild?.children[0]?.type === 'text'
            ? linkChild.children[0].value
            : undefined;
        result.push({ link, label });
      }
    }
  }
  return result;
};

const checkLinksAndLabels = function (
  engArray: LinkAndLabel[],
  translatedArray: LinkAndLabel[],
) {
  engArray.forEach((engLinkAndLabel: LinkAndLabel, index) => {
    const translatedLinkAndLabel: LinkAndLabel = translatedArray[index];

    // Ensure the translated version has text with link,
    // under the same number as the eng version.
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
      // If translated version text with link is present,
      // english version for it should also be present
      expect(engLinkAndLabel).toBeTruthy();
    });
  });
};

const compareLinksTest = (languageCode: string) => {
  const poFileContent = fs.readFileSync(
    `src/core/localization/gettext/${languageCode}/common.po`,
  );

  const poDataFull = gettextParser.po.parse(poFileContent);
  const poData = poDataFull.translations[''] as Record<string, GettextTranslation>;

  for (const [reference, info] of Object.entries(poData) as [
    string,
    GettextTranslation,
  ][]) {
    // exclude "" key
    if (reference) {
      const engText = info.msgid;
      const translatedText = info.msgstr[0];

      const engLinksArr = extractLinkAndLabels(engText);
      const translatedLinksArr = extractLinkAndLabels(translatedText);

      if (translatedText) {
        checkLinksAndLabels(engLinksArr, translatedLinksArr);
      }
    }
  }
};

describe('Links in localized texts', () => {
  describe('Links must be identical between different languages and must all have labels', () => {
    languageCodes.forEach((code) => {
      it(`Check links and labels of ${code.toUpperCase()} locale`, () => {
        compareLinksTest(code);
      });
    });
  });
});
