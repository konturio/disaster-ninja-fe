import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAtom } from '@reatom/react';
import { Link } from 'react-router-dom';
import { Button, Card, Heading, Animation } from '@konturio/ui-kit';
import { getAbsoluteRoute } from '~core/router/getAbsoluteRoute';
import { i18n } from '~core/localization';
import { cookieSettingsAtom } from '../atoms/cookieSettingsAtom';
import s from './CookieConsentBanner.module.css';

type ElementWrapProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const InternalLinkAdapter = (props: ElementWrapProps) => {
  if (props.href === undefined) return <a {...props} />;

  const isExternalLink = props.href?.startsWith('http') || props.href?.startsWith('www');
  return isExternalLink ? (
    <a href={props.href} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  ) : (
    <Link to={getAbsoluteRoute(props.href)}> {props.children}</Link>
  );
};

export function CookieConsentBanner() {
  const [havePrompts, { acceptAll, rejectAll }] = useAtom(cookieSettingsAtom);
  return havePrompts ? (
    <Animation variant="fade-in">
      <Card className={s.cookieBanner}>
        <Heading type="heading-04">{i18n.t('cookie_banner.header')}</Heading>
        <div className={s.body}>
          <ReactMarkdown components={{ a: memo(InternalLinkAdapter) }}>
            {i18n.t('cookie_banner.body')}
          </ReactMarkdown>
        </div>
        <div className={s.buttonsRow}>
          <Button variant="invert-outline" onClick={rejectAll}>
            {i18n.t('cookie_banner.decline_all')}
          </Button>
          <Button onClick={acceptAll}>{i18n.t('cookie_banner.accept_all')}</Button>
        </div>
      </Card>
    </Animation>
  ) : null;
}
