# Structured Markdown

## Structure

The processor generates a hierarchical HTML structure from markdown headings, creating nested sections with consistent IDs and class names.

### Basic Structure

```html
<section>
  <h1 id="hdr-1">Title</h1>
  <div class="wrap-hdr-1">
    <p>Content under Title</p>
    <h2 id="hdr-1-1">Subtitle</h2>
    <div class="wrap-hdr-1-1">
      <p>Content under Subtitle</p>
    </div>
  </div>
</section>
```

### ID Generation

Heading IDs follow a hierarchical pattern:

- Top level: `{idPrefix}-{counter}` (e.g., `hdr-1`)
- Nested: `{idPrefix}-{parent}-{counter}` (e.g., `hdr-1-1`)

Examples:

- First H1: `hdr-1`
- First H2 under first H1: `hdr-1-1`
- Second H2 under first H1: `hdr-1-2`
- First H2 under second H1: `hdr-2-1`

### Linking to Headings

You can create links to specific headings using their IDs. The links can be:

#### Within the same document:

```markdown
[Link to first heading](#hdr-1)
[Link to first subheading under first heading](#hdr-1-1)
[Link to second subheading under first heading](#hdr-1-2)
See [installation instructions](#hdr-2) for setup details
Jump to [API Reference](#hdr-3-1) section
[Link to about page first heading](/about#hdr-1)
```

### Class Names

Content wrapper divs use corresponding class names that match the heading IDs:

- Top level: `{classPrefix}-{idPrefix}-{counter}` (e.g., `wrap-hdr-1`)
- Nested: `{classPrefix}-{idPrefix}-{parent}-{counter}` (e.g., `wrap-hdr-1-1`)

The class prefix can be customized (default: 'wrap').

### Section Breaks

Horizontal rules (`---`) in markdown create separate sections. Each section is wrapped in a `<section>` element:

```html
<section>
  <p>First section content</p>
</section>
<section>
  <p>Second section content</p>
</section>
```

### Customization

The processor accepts two optional parameters:

- `idPrefix`: Prefix for heading IDs (default: 'hdr')
- `classPrefix`: Prefix for wrapper classes (default: 'wrap')

### Content Processing

The processor:

1. Splits content into sections at horizontal rules
2. Creates a hierarchical structure based on heading levels (h1-h6)
3. Wraps content between headings in div elements
4. Maintains heading hierarchy regardless of skipped levels
5. Preserves all content types (paragraphs, lists, code blocks, etc.)

### PagesDocument Component

When using the `PagesDocument` component, additional classes and IDs are added for styling:

#### Document Container

- ID: `app-pages-docid-{id}` (where `id` is provided to PagesDocument)
- Wrapped in default `Article` component (can be customized via `wrapperComponent` prop)

#### Element Classes

- Markdown content rendered inside div:

```html
<div class="app-pages-element-markdown">...</div>
```

### Styling Examples

```css
/* Style specific document */
#app-pages-docid-about {
  /* styles for about page */
}

/* Style all markdown content */
.app-pages-element-markdown {
  /* styles for markdown sections */
}

/* Style specific heading level */
.wrap-hdr-1 {
  /* styles for content under h1 */
}

/* Style nested content */
.wrap-hdr-1-1 {
  /* styles for content under h2 within first h1 */
}

/* Style specific heading by ID */
#hdr-1 {
  /* styles for first h1 */
}

/* Combine selectors for specific sections */
#app-pages-docid-about .wrap-hdr-1 {
  /* styles for first h1 content in about page */
}

/* Style heading links */
.wrap-hdr-1 a[href^='#hdr-'] {
  /* styles for heading links within first section */
}
```

The combination of IDs and classes provides flexible styling options at different levels of specificity, from entire documents to specific sections.
