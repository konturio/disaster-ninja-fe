/**
 * base64url utils for generating JWT token on javascript side
 */
function padString(input: string): string {
  const segmentLength = 4;
  const stringLength = input.length;
  const diff = stringLength % segmentLength;

  if (!diff) {
    return input;
  }

  let position = stringLength;
  let padLength = segmentLength - diff;
  const paddedStringLength = stringLength + padLength;
  const buffer = Buffer.alloc(paddedStringLength);

  buffer.write(input);

  while (padLength--) {
    buffer.write('=', position++);
  }

  return buffer.toString();
}

function toBase64(base64url: string): string {
  // We this to be a string so we can do .replace on it. If it's
  // already a string, this is a noop.
  base64url = base64url.toString();
  return padString(base64url).replace(/\-/g, '+').replace(/_/g, '/');
}

function fromBase64(base64: string): string {
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function base64UrlEncode(
  input: string,
  encoding: BufferEncoding = 'utf8',
): string {
  return fromBase64(Buffer.from(input, encoding).toString('base64'));
}

export function base64UrlDecode(
  base64url: string,
  encoding: BufferEncoding = 'utf8',
): string {
  return Buffer.from(toBase64(base64url), 'base64').toString(encoding);
}
