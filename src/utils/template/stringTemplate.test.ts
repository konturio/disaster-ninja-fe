import { describe, expect, test } from 'vitest';
import {
  parseTemplate,
  createTemplateRenderer,
  compileStringTemplate,
  resolvePropertyPath,
  type NormalizedTemplate,
} from './stringTemplate';

describe('parseTemplate', () => {
  test('parses empty template into single static segment', () => {
    const result = parseTemplate('');
    expect(result).toEqual(['']);
  });

  test('parses template with no placeholders', () => {
    const result = parseTemplate('Hello World');
    expect(result).toEqual(['Hello World']);
  });

  test('parses template with single placeholder', () => {
    const result = parseTemplate('Hello {{name}}!');
    expect(result).toEqual(['Hello ', ['name'], '!']);
  });

  test('parses template with multiple placeholders', () => {
    const result = parseTemplate('Hello {{first}} {{last}}!');
    expect(result).toEqual(['Hello ', ['first'], ' ', ['last'], '!']);
  });

  test('parses template with nested paths', () => {
    const result = parseTemplate('User: {{user.profile.name}}');
    expect(result).toEqual(['User: ', ['user', 'profile', 'name'], '']);
  });

  test('handles placeholders at start of template', () => {
    const result = parseTemplate('{{greeting}} World');
    expect(result).toEqual(['', ['greeting'], ' World']);
  });

  test('handles placeholders at end of template', () => {
    const result = parseTemplate('Total: {{amount}}');
    expect(result).toEqual(['Total: ', ['amount'], '']);
  });

  test('handles consecutive placeholders', () => {
    const result = parseTemplate('{{greeting}}{{name}}');
    expect(result).toEqual(['', ['greeting'], '', ['name'], '']);
  });

  test('handles custom delimiters', () => {
    const result = parseTemplate('Hello ${name}!', { open: '${', close: '}' });
    expect(result).toEqual(['Hello ', ['name'], '!']);
  });

  test('handles single-character delimiters', () => {
    const result = parseTemplate('Hello %name%!', { open: '%', close: '%' });
    expect(result).toEqual(['Hello ', ['name'], '!']);
  });

  test('treats unclosed placeholders as regular text', () => {
    const result = parseTemplate('Hello {{name');
    expect(result).toEqual(['Hello {{name']);
  });

  test('preserves whitespace in static segments', () => {
    const result = parseTemplate('  {{name}}  ');
    expect(result).toEqual(['  ', ['name'], '  ']);
  });

  test('trims whitespace from property paths', () => {
    const result = parseTemplate('Hello {{  name  }}!');
    expect(result).toEqual(['Hello ', ['name'], '!']);
  });
});

describe('createTemplateRenderer', () => {
  test('returns original template for empty data', () => {
    const segments: NormalizedTemplate = ['Hello {{name}}!'];
    const renderer = createTemplateRenderer(segments, 'Hello {{name}}!');
    expect(renderer(null as any)).toBe('Hello {{name}}!');
    expect(renderer(undefined as any)).toBe('Hello {{name}}!');
  });

  test('returns original template for static templates', () => {
    const segments: NormalizedTemplate = ['Static content only'];
    const renderer = createTemplateRenderer(segments, 'Static content only');
    expect(renderer({})).toBe('Static content only');
  });

  test('correctly resolves single placeholder', () => {
    const segments: NormalizedTemplate = ['Hello ', ['name'], '!'];
    const renderer = createTemplateRenderer(segments, 'Hello {{name}}!');
    expect(renderer({ name: 'John' })).toBe('Hello John!');
  });

  test('correctly resolves multiple placeholders', () => {
    const segments: NormalizedTemplate = ['Hello ', ['first'], ' ', ['last'], '!'];
    const renderer = createTemplateRenderer(segments, 'Hello {{first}} {{last}}!');
    expect(renderer({ first: 'John', last: 'Doe' })).toBe('Hello John Doe!');
  });

  test('correctly resolves nested paths', () => {
    const segments: NormalizedTemplate = ['User: ', ['user', 'profile', 'name'], ''];
    const renderer = createTemplateRenderer(segments, 'User: {{user.profile.name}}');
    expect(renderer({ user: { profile: { name: 'Alice' } } })).toBe('User: Alice');
  });

  test('handles missing properties', () => {
    const segments: NormalizedTemplate = ['Hello ', ['name'], '!'];
    const renderer = createTemplateRenderer(segments, 'Hello {{name}}!');
    expect(renderer({})).toBe('Hello !');
  });

  test('handles null/undefined values', () => {
    const segments: NormalizedTemplate = ['Name: ', ['name'], ', Age: ', ['age'], ''];
    const renderer = createTemplateRenderer(segments, 'Name: {{name}}, Age: {{age}}');
    expect(renderer({ name: null, age: undefined })).toBe('Name: , Age: ');
  });

  test('converts non-string values to strings', () => {
    const segments: NormalizedTemplate = [
      'Count: ',
      ['count'],
      ', Active: ',
      ['active'],
      '',
    ];
    const renderer = createTemplateRenderer(
      segments,
      'Count: {{count}}, Active: {{active}}',
    );
    expect(renderer({ count: 42, active: true })).toBe('Count: 42, Active: true');
  });

  test('handles invalid nested paths', () => {
    const segments: NormalizedTemplate = ['Value: ', ['a', 'b', 'c'], ''];
    const renderer = createTemplateRenderer(segments, 'Value: {{a.b.c}}');
    expect(renderer({ a: { x: 1 } })).toBe('Value: ');
    expect(renderer({ a: null })).toBe('Value: ');
    expect(renderer({ a: 5 })).toBe('Value: ');
  });
});

describe('compileStringTemplate', () => {
  test('integrates parsing and rendering for simple template', () => {
    const template = compileStringTemplate('Hello {{name}}!');
    expect(template({ name: 'World' })).toBe('Hello World!');
  });

  test('integrates parsing and rendering for complex template', () => {
    const template = compileStringTemplate(
      'User: {{user.name}} ({{user.role}}) - Score: {{user.score}}',
    );
    expect(
      template({
        user: { name: 'Alice', role: 'Admin', score: 95 },
      }),
    ).toBe('User: Alice (Admin) - Score: 95');
  });

  test('integrates parsing and rendering with custom delimiters', () => {
    const template = compileStringTemplate('Value: ${value}', {
      open: '${',
      close: '}',
    });
    expect(template({ value: 42 })).toBe('Value: 42');
  });

  test('handles array access in property paths', () => {
    const template = compileStringTemplate('First item: {{items.0}}');
    expect(template({ items: ['apple', 'banana'] })).toBe('First item: apple');
  });

  test('handles falsy values correctly', () => {
    const template = compileStringTemplate(
      'Zero: {{zero}}, Empty: {{empty}}, False: {{false}}',
    );
    expect(
      template({
        zero: 0,
        empty: '',
        false: false,
      }),
    ).toBe('Zero: 0, Empty: , False: false');
  });

  test('handles very deep nesting gracefully', () => {
    const template = compileStringTemplate('Deep: {{a.b.c.d.e.f.g.h.i.j.k}}');
    const data = {
      a: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: 'deep' } } } } } } } } } },
    };
    expect(template(data)).toBe('Deep: deep');
  });
});

describe('resolvePropertyPath', () => {
  test('resolves simple property path', () => {
    const obj = { name: 'John' };
    expect(resolvePropertyPath(obj, ['name'])).toBe('John');
  });

  test('resolves nested property path', () => {
    const obj = { user: { profile: { name: 'Alice' } } };
    expect(resolvePropertyPath(obj, ['user', 'profile', 'name'])).toBe('Alice');
  });

  test('handles array access in path', () => {
    const obj = { items: ['apple', 'banana'] };
    expect(resolvePropertyPath(obj, ['items', '0'])).toBe('apple');
  });

  test('converts non-string values to strings', () => {
    const obj = { count: 42, active: true };
    expect(resolvePropertyPath(obj, ['count'])).toBe('42');
    expect(resolvePropertyPath(obj, ['active'])).toBe('true');
  });

  test('returns empty string for missing properties', () => {
    const obj = { name: 'John' };
    expect(resolvePropertyPath(obj, ['age'])).toBe('');
  });

  test('returns empty string for null/undefined values', () => {
    const obj = { name: null, age: undefined };
    expect(resolvePropertyPath(obj, ['name'])).toBe('');
    expect(resolvePropertyPath(obj, ['age'])).toBe('');
  });

  test('returns empty string when path is invalid', () => {
    const obj = { a: { x: 1 } };
    expect(resolvePropertyPath(obj, ['a', 'b', 'c'])).toBe('');
    expect(resolvePropertyPath(obj, ['a', null as any])).toBe('');
    expect(resolvePropertyPath(obj, ['a', undefined as any])).toBe('');
  });

  test('returns empty string when object is null/undefined', () => {
    expect(resolvePropertyPath(null as any, ['name'])).toBe('');
    expect(resolvePropertyPath(undefined as any, ['name'])).toBe('');
  });

  test('returns empty string when path is empty', () => {
    const obj = { name: 'John', age: 30 };
    expect(resolvePropertyPath(obj, [])).toBe('');
  });

  test('handles complex nested objects', () => {
    const obj = {
      user: {
        settings: {
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
      },
    };
    expect(resolvePropertyPath(obj, ['user', 'settings', 'preferences', 'theme'])).toBe(
      'dark',
    );
    expect(
      resolvePropertyPath(obj, ['user', 'settings', 'preferences', 'notifications']),
    ).toBe('true');
  });
});
