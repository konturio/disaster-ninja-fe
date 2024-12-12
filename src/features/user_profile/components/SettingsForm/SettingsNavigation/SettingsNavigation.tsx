import React from 'react';
import { Link } from 'react-scroll';
import s from './SettingsNavigation.module.css';

export function SettingsNavigation({ steps }) {
  return (
    <nav className={s.navigation}>
      <ul>
        {steps.map((step, index) => (
          <li key={index}>
            <Link
              to={`test-${index}`}
              activeClass={s.active}
              spy={true}
              smooth={true}
              containerId="scroll-container"
              offset={-81} // container padding-top + 1px
            >
              {step}
            </Link>
            {/*<a data-to-scrollspy-id={`test-${index}`}>{step} </a>*/}
          </li>
        ))}
      </ul>
    </nav>
  );
}
