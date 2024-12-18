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
  children,
  className,
  label,
}: SettingsSectionProps) => {
  return (
    <div className={styles.sectionWrapper}>
      <section id={id} className={clsx(className, styles.section)}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {label && (
            <div className={styles.labelWrapper}>
              <div className={styles.label}>
                <Heading type="heading-06">{label}</Heading>
              </div>
            </div>
          )}
        </div>
        {children}
      </section>
    </div>
  );
};
