import { useMemo } from 'react';
import cn from 'clsx';
import { Heading, Text } from '@konturio/ui-kit';
import Markdown from 'markdown-to-jsx';
import { nanoid } from 'nanoid';
import { SeverityIndicator } from '~components/SeverityIndicator/SeverityIndicator';
import { i18n } from '~core/localization';
import { ShortLinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import { parseLinksAsTags } from '~utils/markdown/parser';
import { Analytics } from './Analytics/Analytics';
import s from './EventCard.module.css';
import type { Event } from '~core/types';

const language = i18n.instance.language || 'default';

const formatTime = new Intl.DateTimeFormat(language, {
  hour: 'numeric',
  minute: 'numeric',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZoneName: 'short',
}).format;

export function EventCard({
  event,
  isActive,
  onClick,
  alternativeActionControl,
  externalUrls,
  showDescription,
}: {
  event: Event;
  isActive: boolean;
  onClick?: (id: string) => void;
  alternativeActionControl: JSX.Element | null;
  externalUrls?: string[];
  showDescription?: boolean;
}) {
  const formattedTime = useMemo(
    () => formatTime(new Date(event.updatedAt)),
    [event.updatedAt],
  );
  return (
    <button
      className={cn(s.eventCard, { [s.active]: isActive })}
      onClick={() => onClick?.(event.eventId)}
    >
      <div className={s.head}>
        <Heading type="heading-05">
          <span>{event.eventName}</span>
        </Heading>
        <SeverityIndicator severity={event.severity} />
      </div>

      <div className={s.location}>
        <Text type="caption">{event.location}</Text>
      </div>

      {showDescription && event.description && (
        <div className={s.description}>
          <Text type="caption">{event.description}</Text>
        </div>
      )}

      <Analytics
        settledArea={event.settledArea}
        affectedPeople={event.affectedPopulation}
        loss={event.loss}
      />

      {isActive && externalUrls?.length ? (
        <div className={s.linkContainer}>
          {externalUrls.map((link) => (
            <Markdown
              options={{
                overrides: { a: ShortLinkRenderer, p: (props) => <div {...props} /> },
              }}
              className={s.markdown}
              key={nanoid(4)}
            >
              {parseLinksAsTags(link)}
            </Markdown>
          ))}
        </div>
      ) : null}

      <div className={s.footer}>
        <Text type="caption">{i18n.t('updated') + ` ${formattedTime}`}</Text>
        {alternativeActionControl}
      </div>
    </button>
  );
}
