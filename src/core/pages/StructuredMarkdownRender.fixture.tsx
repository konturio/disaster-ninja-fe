import { compiler } from 'markdown-to-jsx';
import { Article } from '~components/Layout';
import { structureMarkdownContent } from './structuredMarkdown';
import _about from './__mocks__/_about.md?raw';
import _landing from './__mocks__/_landing.md?raw';
import _user_guide from './__mocks__/_user_guide.md?raw';
import _landingCss from './__mocks__/_landing.css?raw';
import { CustomLink, CustomImg } from './hypermedia';

export default {
  About: (
    <StructuredMarkdownRender styling={_landingCss} markdown={_about} docId="about" />
  ),
  Landing: (
    <StructuredMarkdownRender styling={_landingCss} markdown={_landing} docId="landing" />
  ),
  UserGuide: (
    <StructuredMarkdownRender
      styling={_landingCss}
      markdown={_user_guide}
      docId="user_guide"
    />
  ),
};

function StructuredMarkdownRender({ styling, markdown, docId }) {
  const compiled = compiler(markdown, {
    overrides: {
      a: CustomLink,
      img: CustomImg,
    },
    wrapper: null,
  }) as unknown as JSX.Element[];

  console.warn(compiled);

  const wrappedContent = structureMarkdownContent(compiled);

  console.warn(wrappedContent);
  return (
    <>
      <style>{styling}</style>
      <Article className={`structuredmd markdown-doc-${docId}`}>{wrappedContent}</Article>
    </>
  );
}
