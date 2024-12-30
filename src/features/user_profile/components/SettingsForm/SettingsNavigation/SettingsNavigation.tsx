import ScrollSpy from 'react-scrollspy-navigation';
import s from './SettingsNavigation.module.css';

export function SettingsNavigation({ steps }) {
  const getOnClick = (id: string) => {
    return (e: React.MouseEvent<HTMLLIElement>) => {
      e.preventDefault();
      const target = window.document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };
  };

  return (
    <ScrollSpy activeClass={s.active}>
      <nav className={s.navigation}>
        <ul>
          {steps.map((step) => (
            <li key={step.id} onClick={getOnClick(step.id)}>
              <a href={`#${step.id}`}>{step.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </ScrollSpy>
  );
}
