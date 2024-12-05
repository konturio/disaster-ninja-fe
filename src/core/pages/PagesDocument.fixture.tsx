import { configRepo } from '~core/config/__mocks__/_configMock';
import _md from './__mocks__/_.md?raw';
import _css from './__mocks__/_.css?raw';
import { PagesDocument } from './index';

console.info('test app id', configRepo.get().id);

export default {
  'PagesDocument with custom css': (
    <PagesDocument
      id=""
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
  'Links test': (
    <PagesDocument
      id=""
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
  'PagesDocument markdown sample': (
    <PagesDocument
      id=""
      doc={[
        {
          type: 'md',
          data: _md,
        },
        {
          type: 'css',
          data: _css,
        },
      ]}
    />
  ),
};

/*
div#root
  > div#app-id-58851b50-9574-4aec-a3a6-425fa18dcb54._common_1dp5y_1
    > span#app-route-privacy > div.keep-alive-render > div.cache-component.active
      > article#app-pages-docid-privacy._article_ov122_1.
        > div.app-pages-element-markdown
          > section
*/
