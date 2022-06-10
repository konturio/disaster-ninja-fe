// TODO. For now this parser only handles links with protocol prefix.
// We're gonna need to parse all kinds of links in a task #10183
export function parseLinksAsTags(text?: string): string {
  if (!text) return '';
  let parsed = text;
  // In regex we cannot use negative lookbehind because of Safari:(
  // Therefore i need to implement following logic:
  // this regex will find all the links, both in standart and .md format. '.md' format is [label](link)
  // with 2 extra characters at the begining (to throw away links in .md format)

  // See regex explanation at https://regex101.com/
  const regex =
    /(.?.?https|.?.?http)(:\/\/)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm;
  const matchIterable = text.matchAll(regex);

  // After pasting in link in markdown format text length will increase
  // pointer will help us follow that to paste next link in the right place
  let pointer = 0;

  [...matchIterable].forEach((matchEntity) => {
    const [match, protocol, , domain, path] = matchEntity;
    const matchIndex = matchEntity.index!;
    const matchLength = match.length;
    // skip links in propper markdown format
    if (match.startsWith('](') || match.indexOf('[http') > -1) return;
    // get full link to work with it
    const linkStartIndex = match.indexOf('http');
    const fullLink = match.substring(linkStartIndex);
    const beforeLink = match.substring(0, linkStartIndex);

    const finalText = spliceString(parsed)(
      matchIndex + pointer,
      matchLength + pointer,
      `${beforeLink}[${domain}${path ?? ''}](${fullLink})`,
    );

    pointer +=
      `[${domain}${path ?? ''}](${fullLink})`.length -
      (matchLength - beforeLink.length);
    parsed = finalText;
  });

  return parsed;
}

function spliceString(
  string: string,
): (index: number, count: number, add: string) => string {
  return function (index: number, count: number, add: string): string {
    if (index < 0) {
      index += string.length;
      if (index < 0) index = 0;
    }
    return string.slice(0, index) + (add || '') + string.slice(index + count);
  };
}
