import { fromMarkdown } from 'mdast-util-from-markdown';
import type { Link } from 'mdast-util-from-markdown/lib';

export type LinkAndLabel = {
  link?: string;
  label?: string;
};

/**
 * Function for extracting an array of links from a markdown string
 * @param markdownString input markdown string
 * @returns array of { link, label } objects
 */

export const extractLinkAndLabels = (markdownString: string): LinkAndLabel[] => {
  const result: LinkAndLabel[] = [];
  const paragraph = fromMarkdown(markdownString).children[0];
  if (paragraph?.type === 'paragraph') {
    const linkChildren: Link[] = paragraph.children.filter(
      (chart) => chart.type === 'link',
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
