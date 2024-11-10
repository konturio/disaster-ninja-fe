# Structured Markdown

## Overview

The structured markdown processor transforms markdown content into a hierarchical HTML structure with consistent IDs and class names, making it easy to style and reference specific sections.

## Features

- Hierarchical heading structure (h1-h6)
- Automatic ID generation for headings
- Section-based content organization
- Customizable ID and class prefixes
- Support for horizontal rule section breaks
- Special handling for links and media

## Basic Structure

The processor generates a nested HTML structure like this:

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

### Content Processing

The processor:

1. Splits content into sections at horizontal rules
2. Creates a hierarchical structure based on heading levels (h1-h6)
3. Wraps content between headings in div elements
4. Maintains heading hierarchy regardless of skipped levels
5. Preserves all content types (paragraphs, lists, code blocks, etc.)

For customization options and styling examples, see [customization.md](./customization.md).

### Media Embeds

The markdown processor supports embedding media content using standard markdown image syntax:

#### Images and YouTube Videos

```markdown
# Regular image

![Alt text](path/to/image.jpg)

# Image with custom dimensions

![Alt text](path/to/image.jpg::800,600)

# Default YouTube embed (560x315)

![Video title](https://youtube.com/watch?v=xyz)

# YouTube with custom dimensions and fullscreen option

![Video title](https://youtube.com/watch?v=xyz::800,450,1)
```

Parameter syntax: `::width,height,allowFullscreen`

- Width and height are in pixels
- allowFullscreen is boolean (1 or 0)
