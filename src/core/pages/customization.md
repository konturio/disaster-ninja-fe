# Customization Guide

## Processor Configuration

The markdown processor accepts two optional parameters for customizing IDs and classes:

- `idPrefix`: Prefix for heading IDs (default: 'hdr')
- `classPrefix`: Prefix for wrapper classes (default: 'wrap')

## PagesDocument Component

### Container Structure

The `PagesDocument` component adds additional classes and IDs for styling:

- Container ID: `app-pages-docid-{id}` (where `id` is provided to PagesDocument)
- Default wrapper: `Article` component (customizable via `wrapperComponent` prop)
- Markdown content wrapper: `<div class="app-pages-element-markdown">`

### Styling Examples

```css
/* Target specific document */
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
