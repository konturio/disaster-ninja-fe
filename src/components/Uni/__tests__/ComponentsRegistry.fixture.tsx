import { componentsRegistry } from '../componentsRegistry';

export default function ComponentsRegistry() {
  return (
    <div>
      {Object.keys(componentsRegistry).map((component) => (
        <div key={component}>
          <code>{component}</code>
        </div>
      ))}
    </div>
  );
}
