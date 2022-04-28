export function parseLinksAsTags(text?: string): string {
  if (!text) return '';
  let parsed = text;
  // this regex will find all the links, both in standart and .md format. '.md' format is [label](link)
  // with extra character at the begining
  // See regex explanation at https://regex101.com/
  const regex =
    /(.?https|.?http)(:\/\/)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm;
  const matchIterable = text.matchAll(regex);

  [...matchIterable].forEach(([match, protocol, , domain, path]) => {
    // skip links in propper markdown format
    if (match.startsWith('(')) return;
    // get full link to work with it
    const fullLink = match.startsWith('http') ? match : match.substring(1);

    parsed = parsed.replace(fullLink, `[${domain}${path ?? ''}](${fullLink})`);
  });
  return parsed;
}
