import { Panel, PanelIcon } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback } from 'react';
import { panelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import s from './PrimaryAndSecondaryPanel.module.css';
import type { PanelFeatureInterface } from 'types/featuresTypes';

type PanelProps = {
  primaryProps?: PanelFeatureInterface | null;
  secondaryProps?: PanelFeatureInterface | null;
  id?: string;
};

export function PrimaryAndSecondaryPanelWidget({
  primaryProps,
  secondaryProps,
  id,
}: PanelProps) {
  const { panelState, panelControls, setPanelState } = useShortPanelState(
    Boolean(!primaryProps || !secondaryProps),
  );

  const isOpen = panelState !== 'closed';
  const isShort = panelState === 'short';
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const getProperty = useCallback(
    function <K extends keyof PanelFeatureInterface>(property: K) {
      return isShort ? secondaryProps?.[property] : primaryProps?.[property];
    },
    [isShort, primaryProps, secondaryProps],
  );

  const minHeight = getProperty('minHeight') || secondaryProps?.minHeight || 0;
  const maxHeight = getProperty('maxHeight');
  const contentHeight = getProperty('contentheight');

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    minHeight,
    id || 'primary_and_secondary',
    isShort ? secondaryProps?.skipAutoResize : primaryProps?.skipAutoResize,
  );

  const onPanelIconClick = useCallback(() => {
    setPanelState('full');
  }, [setPanelState]);

  const onPanelClose = useCallback(() => {
    setPanelState('closed');
  }, [setPanelState]);

  useAutoCollapsePanel(isOpen, onPanelClose);

  if (!primaryProps && !secondaryProps) return null;

  const header = !primaryProps ? secondaryProps!.header : primaryProps.header;
  const panelIcon = !primaryProps ? secondaryProps!.panelIcon : primaryProps.panelIcon;

  const panelContent = {
    full: primaryProps?.content || secondaryProps!.content,
    short: secondaryProps?.content,
    closed: <></>,
  };

  return (
    <>
      <Panel
        header={header}
        headerIcon={panelIcon || undefined}
        className={clsx(s.panel, isOpen ? s.show : s.collapse)}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{ onModalClick: onPanelClose, showInModal: isMobile }}
        resize={isMobile || isShort ? 'none' : 'vertical'}
        contentClassName={s.contentWrap}
        contentContainerRef={handleRefChange}
        customControls={panelControls}
        // TODO look at it
        contentHeight={contentHeight}
        minContentHeight={minHeight}
        maxContentHeight={maxHeight}
      >
        {panelContent[panelState]}
      </Panel>

      <PanelIcon
        clickHandler={onPanelIconClick}
        className={clsx(
          s.panelIcon,
          isOpen && s.hide,
          !isOpen && s.show,
          isMobile ? s.mobile : s.desktop,
        )}
        icon={panelIcon || <></>}
      />
    </>
  );
}
