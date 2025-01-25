import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import type { Event } from '~core/types';
import type {
  FeatureCardCfg,
  FeatureCardItem,
} from '~features/layer_features_panel/components/CardElements';
import type { ActionItem } from '~features/layer_features_panel/components/CardElements/ActionButtons';

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

export function eventToFeatureCard(event: Event, full = false): FeatureCardCfg {
  const formattedUpdatedAt = formatTime(event.updatedAt);
  const formattedStartedAt = formatTime(event.startedAt);

  // Properly typed items array
  const items: FeatureCardItem[] = [
    { type: 'severity', severity: event.severity },
    {
      type: 'title',
      title: event.eventName,
    },
    {
      type: 'text',
      text: event.location,
    },
  ];

  const icl: ActionItem[] = [
    {
      type: 'icl',
      title: `${formatNumber(event.affectedPopulation)}`,
      alt: i18n.t('event_list.analytics.affected_people.tooltip'),
      data: '',
      icon: 'People16',
    },
    {
      type: 'icl',
      title: `${formatNumber(Math.round(event.settledArea))} km²`,
      alt: i18n.t('event_list.analytics.settled_area_tooltip'),
      icon: 'Area16',
    },
  ];

  if (event.osmGaps) {
    icl.push({
      type: 'icl',
      title: `${event.osmGaps.toString()}%`,
      data: '',
      icon: 'Map16',
    });
  }

  if (event.loss) {
    icl.push({
      type: 'icl',
      title: `$${formatNumber(event.loss)} estimated loss`,
      alt: i18n.t('event_list.analytics.loss_tooltip'),
      data: '',
      icon: 'DollarCircle16',
    });
  }

  items.push({
    type: 'actions' as const,
    items: icl,
  });

  if (full) {
    items.push(
      // Description
      {
        type: 'text',
        text: event.description || '',
      },
    );

    if (hasTimeline && event.episodeCount > 1) {
      items.push({
        type: 'actions',
        items: [
          {
            type: 'fsa',
            title: `Episodes`,
            data: event.eventId,
          },
        ],
      });
    }

    items.push({
      type: 'actions',
      items: event.externalUrls.map((url, index) => ({
        title: `${getDomainFromUrl(url)}`,
        type: 'external_link',
        data: url,
      })),
    });
  }

  items.push(
    {
      type: 'text',
      text: `${i18n.t('started')} ${formattedStartedAt}`,
    },
    {
      type: 'text',
      text: `${i18n.t('updated')} ${formattedUpdatedAt}`,
    },
  );

  const res = {
    id: Number(event.eventId),
    focus: event.bbox,
    properties: event,
    items,
  };

  return res;
}
