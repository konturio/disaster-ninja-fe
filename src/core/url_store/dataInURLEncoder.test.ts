import { expect, test, describe } from 'vitest';
import { URLDataInSearchEncoder } from './dataInURLEncoder';
import { urlEncoder } from './encoder';

describe('Decode search query components', () => {
  test('With custom transformers', () => {
    const codec = new URLDataInSearchEncoder({
      transformers: {
        map: {
          decode: (str: string) => str.split('/'),
          encode: () => null,
        },
      },
    });

    expect(codec.decode('?map=z/x/y')).toStrictEqual({
      map: ['z', 'x', 'y'],
    });
  });

  // # Prod issue #9591
  test('Can decode urls with pluses instead of spaces', () => {
    const codec = new URLDataInSearchEncoder();

    expect(
      codec.decode('?layers=BIV__Kontur+Fire+Service+Scarcity+Risk'),
      'With spaces as pluses',
    ).toStrictEqual({
      layers: 'BIV__Kontur Fire Service Scarcity Risk',
    });

    expect(
      codec.decode('?layers=BIV__Kontur%20Fire%20Service%20Scarcity%20Risk'),
      'With escaped spaces',
    ).toStrictEqual({
      layers: 'BIV__Kontur Fire Service Scarcity Risk',
    });
  });
});

describe('Encode search query components', () => {
  test('In right order', () => {
    const codec = new URLDataInSearchEncoder({
      order: ['baz', 'bar', 'foo'],
    });

    expect(
      codec.encode({
        unknown: 'unknown',
        foo: 'foo',
        bar: 'bar',
        baz: 'baz',
      }),
    ).toBe('baz=baz&bar=bar&foo=foo&unknown=unknown');
  });

  test('With custom transformers', () => {
    const codec = new URLDataInSearchEncoder({
      transformers: {
        map: {
          decode: (str: string) => null,
          encode: (position: [number, number, number]) => position.join('/'),
        },
      },
    });

    expect(codec.encode({ map: [1, 2, 3] })).toBe('map=1/2/3');
  });
});

test('Work without losses', () => {
  const data = {
    foo: 'foo',
    number: 0,
    nonlatin: 'ёж',
    space: 's p a c e',
    array: ['foo', 'bar', 'baz'],
    special: '!@#$%^&*()_',
  };

  const codec = new URLDataInSearchEncoder({
    transformers: {
      number: {
        decode: (str: string) => Number(str),
        encode: (num: number) => String(num),
      },
      array: {
        decode: (str: string) => str.split(','),
        encode: (arr: string[]) => arr.join(','),
      },
    },
  });

  expect(codec.decode(codec.encode(data))).toStrictEqual(data);
});

test('Coordinates with absolute value < 0.001 are converted to 0.000', () => {
  const data = urlEncoder.encode({ map: [2, -0.0001, 0.00004] });
  expect(data).toBe('map=3.000/0.000/0.000');
});
