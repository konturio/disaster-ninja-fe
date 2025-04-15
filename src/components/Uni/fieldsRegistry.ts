import { i18n } from '~core/localization';

export interface FieldMeta {
  type: string;
  format?: string;
  text?: (formattedValue: string) => string;
  label?: string;
  tooltip?: string;
  icon?: string;
}

const fieldsRegistry: Record<string, FieldMeta> = {
  default: {
    type: 'text',
  },
  affectedPopulation: {
    type: 'number',
    tooltip: i18n.t('event_list.analytics.affected_people.tooltip'),
    icon: 'People16',
    format: 'number',
  },
  settledArea: {
    type: 'number',
    tooltip: i18n.t('event_list.analytics.settled_area_tooltip'),
    icon: 'Area16',
    format: 'square_km',
  },
  osmGaps: {
    type: 'number',
    tooltip: i18n.t('estimated_osm_gaps'),
    icon: 'OsmGaps16',
    format: 'percentage_rounded',
  },
  loss: {
    type: 'number',
    tooltip: i18n.t('event_list.analytics.loss_tooltip'),
    icon: 'DollarCircle16',
    format: 'currency',
  },
  // date
  startedAt: {
    type: 'date',
    label: i18n.t('started'),
    format: 'date',
  },
  created: {
    type: 'date',
    label: i18n.t('created'),
    format: 'date',
  },
  updatedAt: {
    type: 'date',
    label: i18n.t('updated'),
    format: 'date',
  },
  // HOT
  mappingTypes: {
    type: 'text',
    label: i18n.t('mapping_types'),
    // format: 'textCapitalize',
  },
  projectId: {
    type: 'number',
    text: (v) => `#${v}`,
    // format: 'textCapitalize',
  },
};

// aliases
fieldsRegistry['lastUpdated'] = fieldsRegistry.updatedAt;

export { fieldsRegistry };
