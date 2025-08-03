import { useAtom as useAtomV3 } from '@reatom/npm-react';
import { i18n } from '~core/localization';
import { localEventFiltersAtom } from '~features/events_list/atoms/localEventListFiltersConfig';
import type { EventType, Severity } from '~core/types';
import type { ChangeEvent } from 'react';

const eventTypes: EventType[] = [
  'FLOOD',
  'TSUNAMI',
  'WILDFIRE',
  'THERMAL_ANOMALY',
  'INDUSTRIAL_HEAT',
  'TORNADO',
  'WINTER_STORM',
  'EARTHQUAKE',
  'STORM',
  'CYCLONE',
  'DROUGHT',
  'VOLCANO',
  'OTHER',
];

const severities: Severity[] = ['TERMINATION', 'MINOR', 'MODERATE', 'SEVERE', 'EXTREME'];

export function EventFilters() {
  const [filters, setFilters] = useAtomV3(localEventFiltersAtom);
  const cfg = filters || {};

  const onEventTypesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (o) => o.value as EventType,
    );
    setFilters((prev) => ({
      ...(prev || {}),
      eventTypes: selected.length ? selected : undefined,
    }));
  };

  const onSeverityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Severity;
    setFilters((prev) => ({ ...(prev || {}), minSeverity: value || undefined }));
  };

  const onCountryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...(prev || {}), country: value || undefined }));
  };

  const onStartFromChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...(prev || {}), minStartedAt: value || undefined }));
  };

  const onStartToChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...(prev || {}), maxStartedAt: value || undefined }));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <label>
        {i18n.t('event_list.filter_type_label')}
        <select multiple value={cfg.eventTypes || []} onChange={onEventTypesChange}>
          {eventTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        {i18n.t('event_list.filter_severity_label')}
        <select value={cfg.minSeverity || ''} onChange={onSeverityChange}>
          <option value="" />
          {severities.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        {i18n.t('event_list.filter_date_from_label')}
        <input type="date" value={cfg.minStartedAt || ''} onChange={onStartFromChange} />
      </label>
      <label>
        {i18n.t('event_list.filter_date_to_label')}
        <input type="date" value={cfg.maxStartedAt || ''} onChange={onStartToChange} />
      </label>
      <label>
        {i18n.t('event_list.filter_country_label')}
        <input type="text" value={cfg.country || ''} onChange={onCountryChange} />
      </label>
    </div>
  );
}
