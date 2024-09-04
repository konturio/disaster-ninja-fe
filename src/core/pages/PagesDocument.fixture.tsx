import { configRepo } from './tests/_configMock';
import _landing from './tests/_landing.md?raw';
import _landingCss from './tests/_landing.css?raw';
import _plans from './tests/_plans.md?raw';
import { PagesDocumentRenderer } from './index';

console.info('test app id', configRepo.get().id);

export default {
  PagesDocumentRenderer: (
    <PagesDocumentRenderer
      doc={[
        {
          type: 'md',
          data: `
#Kontur Atlas
Atlas is your GPS for big decisions. It's a tool that helps you use maps and data to figure out a wide range of things, from where to open a new store to exploring environmental sustainability.
`,
        },
        {
          type: 'css',
          data: `
h1 { background-color: #f2f2f2; }
p { background-color: #BF6C3F; }
`,
        },
      ]}
    />
  ),
  Plans: (
    <PagesDocumentRenderer
      doc={[
        {
          type: 'css',
          data: _landingCss,
        },
        {
          type: 'md',
          data: _plans,
        },
      ]}
    />
  ),
  WithCustomLink: (
    <PagesDocumentRenderer
      doc={[
        {
          type: 'md',
          data: `
[Link](https://example.com)

Controller using this email: [hello@kontur.io](mailto:hello@kontur.io) or contact address.

Controller using this email: <hello@kontur.io> or contact address.

hello@kontur.io

kancelaria@uodo.gov.pl

ng: <kancelaria@uodo.gov.pl>

http://www.youronlinechoices.com/

ng: <http://www.youronlinechoices.com/>
`,
        },
      ]}
    />
  ),
  WithSections: (
    <PagesDocumentRenderer
      doc={[
        {
          type: 'css',
          data: _landingCss,
        },
        {
          type: 'md',
          data: _landing,
        },
      ]}
    />
  ),
};
