import React from 'react';
import { Link } from 'react-scroll';
import s from './SettingsNavigation.module.css';

export function SettingsNavigation({ steps, containerId, offset }) {
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
              containerId={containerId}
              offset={offset}
            >
              {step}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
