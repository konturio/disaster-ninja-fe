import React from 'react';
import { Link } from 'react-scroll';
import s from './SettingsNavigation.module.css';

export function SettingsNavigation({ steps, containerId, offset }) {
  return (
    <nav className={s.navigation}>
      <ul>
        {steps.map((step) => (
          <li key={step.id}>
            <Link
              to={step.id}
              activeClass={s.active}
              spy={true}
              smooth={true}
              containerId={containerId}
              offset={offset}
            >
              {step.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
