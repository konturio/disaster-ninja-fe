export function createContainerInWebComponent(settings: {
  webComponentTag: string;
  injectCss?: string;
}) {
  const container = document.createElement('div');
  class MapWebComponent extends HTMLElement {
    container = container;
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'closed' });

      // Create some CSS to apply to the shadow dom
      const style = document.createElement('style');
      style.textContent =
        `
        .wrapper {
          position: relative;
          display: block;
          height: 100%;
          width: 100vw;
        }
      ` + settings.injectCss ?? '';

      // Attach the created elements to the shadow dom
      shadow.appendChild(style);
      shadow.appendChild(container);
      container.setAttribute('class', 'wrapper');
    }
  }
  customElements.define('map-gl', MapWebComponent);
  return container;
}
