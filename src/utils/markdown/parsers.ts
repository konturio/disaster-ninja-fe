// this regex will only find links that are not in .md format already [label](link).
// See regex explanation at https://regex101.com/
export function parseLinksAsTags(text?: string): string {
  if (!text) return '';
  let parsed = text;
  const regex =
    /((?<!\[|\()http|(?<!\[|\()https)(:\/\/)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/gm;
  const matchIterable = text.matchAll(regex);

  [...matchIterable].forEach(([match, protocol, , domain, path]) => {
    parsed = parsed.replace(match, `[${domain}${path ?? ''}](${match})`);
  });
  return parsed;
}
