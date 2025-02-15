import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import type { UniCardCfg, UniCardItem } from '~components/Uni/Elements';
import type { Event } from '~core/types';

const featureFlags = configRepo.get().features;
const hasTimeline = !!featureFlags['episodes_timeline'];
function shouldShowTimeline(event: Event, hasTimeline: boolean): boolean {
  return hasTimeline && event.episodeCount > 1;
}

const SEVERITY_COLORS = {
  EXTREME: 'var(--error-strong)',
  MODERATE: 'var(--warning-strong)',
  LOW: 'var(--base-strong)',
} as const;

const SEVERITY_BG_COLORS = {
  EXTREME: '#F8DDE0',
  MODERATE: '#FFE7CC',
  LOW: 'var(--faint-weak)',
} as const;

// Temporary formatters until we fix imports
const language = i18n.instance.language || 'default';

const dateFormatter = new Intl.DateTimeFormat(language, {
  hour: 'numeric',
  minute: 'numeric',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZoneName: 'short',
}).format;
function formatTime(date?: string) {
  return date ? dateFormatter(new Date(date)) : '';
}
const formatNumber = (n: number) => n.toLocaleString();
const formatDate = (d: string) => new Date(d).toLocaleDateString();
const getDomainFromUrl = (url: string) => new URL(url).hostname.replace(/^www\./, '');

export function eventToFeatureCard(event: Event, full = false): UniCardCfg {
  const formattedUpdatedAt = formatTime(event.updatedAt);
  const formattedStartedAt = formatTime(event.startedAt);

  // Properly typed items array
  const items: UniCardItem[] = [
    { severity: event.severity },
    { title: event.eventName },
    { text: event.location },
  ];

  const icl = [
    {
      title: `${formatNumber(event.affectedPopulation)}`,
      alt: i18n.t('event_list.analytics.affected_people.tooltip'),
      icon: 'People16',
    },
    {
      title: `${formatNumber(Math.round(event.settledArea))} km²`,
      alt: i18n.t('event_list.analytics.settled_area_tooltip'),
      icon: 'Area16',
    },
  ];

  if (event.osmGaps) {
    icl.push({ title: `${event.osmGaps.toString()}%`, icon: 'OsmGaps16' });
  }

  if (event.loss) {
    icl.push({
      title: `$${formatNumber(event.loss)} estimated loss`,
      alt: i18n.t('event_list.analytics.loss_tooltip'),
      icon: 'DollarCircle16',
    });
  }

  items.push({ icl });

  if (full) {
    items.push(
      // Description
      { text: event.description || '' },
    );

    if (hasTimeline && event.episodeCount > 1) {
      items.push({
        actions: [{ type: 'fsa', title: `Episodes`, data: event.eventId }],
      });
    }

    items.push({
      actions: event.externalUrls.map((url, index) => ({
        title: `${getDomainFromUrl(url)}`,
        type: 'external_link',
        data: url,
      })),
    });
  }

  items.push(
    { text: `${i18n.t('started')} ${formattedStartedAt}` },
    { text: `${i18n.t('updated')} ${formattedUpdatedAt}` },
  );

  const res = {
    id: event.eventId,
    focus: event.bbox,
    properties: event,
    items,
  };

  console.log('CARD:', res);

  return res;
}
