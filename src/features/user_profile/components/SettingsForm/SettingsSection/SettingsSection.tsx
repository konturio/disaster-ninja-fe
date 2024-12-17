import React from 'react';
import clsx from 'clsx';
import { Heading } from '@konturio/ui-kit';
import styles from './SettingSection.module.css';
import type { ReactNode } from 'react';

export type SettingsSectionProps = {
  title: string;
  id?: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  label?: string;
};

export const SettingsSection = ({
  title,
  id,
  description,
  children,
  className,
  label,
}: SettingsSectionProps) => {
  return (
    <div className={styles.sectionWrapper}>
      <section id={id} className={clsx(className, styles.section)}>
        <div className={styles.header}>
          <Heading type="heading-03">{title}</Heading>
          {label && (
            <div className={styles.labelWrapper}>
              <div className={styles.label}>
                <Heading type="heading-06" className={styles.labelText}>
                  {label}
                </Heading>
              </div>
            </div>
          )}
        </div>
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </section>
    </div>
  );
};
