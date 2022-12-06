const css = (s: { raw: readonly string[] }) => s.raw[0]; // Do nothing, just allow use css`` tag for syntax highlight in ide

const style = css`
  .cosmos-ui-kit-decorator {
    padding: 1em;
    display: flex;
    gap: 2em;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    box-sizing: border-box;
    background-color: #fff;
    --transp-clr: #f5f5f5;
    background-image: linear-gradient(
        45deg,
        var(--transp-clr) 25%,
        transparent 25%,
        transparent 75%,
        var(--transp-clr) 75%
      ),
      linear-gradient(
        45deg,
        var(--transp-clr) 25%,
        transparent 25%,
        transparent 75%,
        var(--transp-clr) 75%
      );
    background-size: 24px 24px;
    background-position: 0 0, 12px 12px;
  }
`;

export default function CosmosDecorator({ children }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: style }}></style>
      <div className="cosmos-ui-kit-decorator">{children}</div>
    </>
  );
}
