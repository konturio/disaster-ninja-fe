const SECTION_NAME_REGEX = /<!--\s*([a-zA-Z0-9_-]*)\s*-->/g;

export function splitTextIntoSections(
  text: string,
  initialSectionName: string = 'INITIAL',
  defaultSectionName: string = 'DEFAULT',
): [string, string][] {
  if (!text) return [];

  const sections: [string, string][] = [];
  const parts = text.split(SECTION_NAME_REGEX);

  // Check if the text starts with a section name
  const startsWithSection = text.trimStart().startsWith('<!--');

  for (let i = 0; i < parts.length; i++) {
    if (i === 0 && !startsWithSection) {
      // Initial section
      sections.push([initialSectionName, parts[i].trim()]);
    } else if (i % 2 === 1) {
      // Section name
      const sectionName = parts[i].trim() || defaultSectionName;
      const content = (parts[i + 1] || '').trim();
      sections.push([sectionName, content]);
    }
  }

  // Handle case when text ends with a section name
  if (text.trim().endsWith('-->') && sections[sections.length - 1][1] !== '') {
    const lastSectionName = parts[parts.length - 1].trim() || defaultSectionName;
    sections.push([lastSectionName, '']);
  }

  return sections;
}
