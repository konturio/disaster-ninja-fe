import { Button } from '@konturio/ui-kit';
import { Fragment } from 'react';
import * as icons from '@konturio/default-icons';
import clsx from 'clsx';
import { resolveValue } from '~core/toolbar/utils';
import s from './ToolbarContent.module.css';
import type {
  ControlID,
  ToolbarSettings,
  ToolbarControlSettings,
} from '~core/toolbar/types';

const DrawToolsWidget = () => {
  return (
    <Button
      variant="invert-outline"
      iconBefore={<icons.EditGeometry16 width={16} height={16} />}
      size="large"
      className={s['control-large']}
    >{`Edit/draw\ngeometry`}</Button>
  );
};

export const ToolbarContent = () => {
  const settings: ToolbarSettings = {
    sections: [
      {
        name: 'Tools',
        controls: [
          'locate-me',
          'measure-distance',
          'edit-in-osm',
          'calculate-mcda',
          'create-layer',
        ],
      },
      {
        name: 'Working with selected area',
        controls: ['select-admin-unit', 'upload-geojson', 'edit-geometry'],
      },
    ],
  };

  const buttons: Record<ControlID, ToolbarControlSettings> = {
    'locate-me': {
      id: 'locate-me',
      type: 'button',
      typeSettings: {
        name: 'Locate me',
        icon: 'Info24',
        hint: 'Locate me',
        preferredSize: 'tiny',
      },
    },
    'measure-distance': {
      id: 'measure-distance',
      type: 'button',
      typeSettings: {
        name: 'Measure distance',
        icon: 'Info24',
        hint: 'Measure distance',
        preferredSize: 'tiny',
      },
    },
    'edit-in-osm': {
      id: 'edit-in-osm',
      type: 'button',
      typeSettings: {
        name: 'Edit in OSM',
        icon: 'Info24',
        hint: 'Edit in OSM',
        preferredSize: 'tiny',
      },
    },
    'calculate-mcda': {
      id: 'calculate-mcda',
      type: 'button',
      typeSettings: {
        name: 'Calculate\nMCDA',
        icon: 'Info24',
        hint: 'Calculate MCDA',
        preferredSize: 'large',
      },
    },
    'create-layer': {
      id: 'create-layer',
      type: 'button',
      typeSettings: {
        name: 'Create\nlayer',
        icon: 'Info24',
        hint: 'Create layer',
        preferredSize: 'large',
      },
    },
    'select-admin-unit': {
      id: 'select-admin-unit',
      type: 'button',
      typeSettings: {
        name: 'Select\nadmin unit',
        icon: 'Info24',
        hint: 'Select admin unit',
        preferredSize: 'large',
      },
    },
    'upload-geojson': {
      id: 'upload-geojson',
      type: 'button',
      typeSettings: {
        name: 'Upload\nGeoJSON',
        icon: 'Info24',
        hint: 'Upload GeoJSON',
        preferredSize: 'large',
      },
    },
    'edit-geometry': {
      id: 'edit-geometry',
      type: 'widget',
      typeSettings: {
        component: DrawToolsWidget,
      },
    },
  };

  return (
    <div className={s.toolbarContent}>
      {settings.sections.map((section, index) => (
        <Fragment key={section.name}>
          {index > 0 && <div className={s.sectionDivider}></div>}
          <div className={s.section}>
            <div className={s.sectionContent}>
              {section.controls.map((id) => renderControl(id, buttons[id]))}
            </div>
            <div className={s.sectionLabel}>{section.name}</div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

const renderControl = (id: ControlID, settings: ToolbarControlSettings) => {
  switch (settings.type) {
    case 'button':
      const Icon = icons[resolveValue(settings.typeSettings.icon, 'regular')];
      return (
        <Button
          key={id}
          variant="invert-outline"
          iconBefore={<Icon width={16} height={16} />}
          size={settings.typeSettings.preferredSize}
          className={clsx(s[`control-${settings.typeSettings.preferredSize}`])}
        >
          {resolveValue(settings.typeSettings.name, 'regular')}
        </Button>
      );

    case 'widget':
      return (
        <settings.typeSettings.component
          key={id}
          state="regular"
          controlClassName=""
          onClick={() => {
            ('');
          }}
        />
      );
  }
};
