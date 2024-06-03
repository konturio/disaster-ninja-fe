import { InfoOutline16 } from '@konturio/default-icons';
import { useLayoutEffect, useRef } from 'react';
import { i18n } from '~core/localization';
import { PopupTooltipWrapper } from '~components/PopupTooltipTrigger';
import s from './AxisCaptions.module.css';

const AXIS_CAPTIONS_TOOTIP_TEXT = (
  <div className={s.axisCaptionText}>
    <p>{i18n.t('bivariate.matrix.caption.tooltip.p1')}</p>
    <ul>
      <li>{i18n.t('bivariate.matrix.caption.tooltip.li1')}</li>
      <li>{i18n.t('bivariate.matrix.caption.tooltip.li2')}</li>
    </ul>
    <br />
    <b>{i18n.t('bivariate.matrix.caption.tooltip.b')}</b>
    <p>{i18n.t('bivariate.matrix.caption.tooltip.p2')}</p>
    <p>{i18n.t('bivariate.matrix.caption.tooltip.p3')}</p>
  </div>
);

const popupClasses = { popupContent: s.popupContent };

export const AxisCaptions = ({ baseDimension = 0 }: { baseDimension: number }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  // we want to scroll to the center of the matrix when it's opened
  useLayoutEffect(() => {
    rootRef.current?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <div className={s.axisCaptionRoot} ref={rootRef}>
      <div className={s.axisCaptionAnchor} style={{ left: -baseDimension }}>
        <PopupTooltipWrapper
          hoverBehavior={false}
          tooltipId="axis_caption"
          tooltipText={AXIS_CAPTIONS_TOOTIP_TEXT}
          popupClasses={popupClasses}
        >
          {({ showTooltip }) => (
            <div className={s.axisCaptionBody}>
              <LongArrow position="left" />
              <br />

              <div className={s.tooltipHover} onClick={showTooltip}>
                <span>{i18n.t('bivariate.matrix.caption.base_axis')}</span>
                <InfoOutline16 />
                <span>{i18n.t('bivariate.matrix.caption.annex_axis')}</span>
              </div>

              <br />
              <LongArrow position="right" />
            </div>
          )}
        </PopupTooltipWrapper>
      </div>
    </div>
  );
};

const LongArrow = ({ position = 'left' }: { position: 'left' | 'right' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="6"
    height="22"
    viewBox="0 0 6 22"
    fill="none"
    transform={position === 'left' ? 'rotate(90)' : 'rotate(-90)'}
  >
    <path
      d="M3 1V20.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 18L3 21.5L5 18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
