import s from './AnalyticsData.module.css';
import { AnalyticsData } from '~appModule/types';
import { TranslationService as t } from '~core/localization';

interface AnalyticsDataListProps {
  data?: AnalyticsData[] | null;
  links?: string[];
}

const Sub = ({ children }) => (
  <span style={{ fontSize: '.7em', verticalAlign: 'super' }}>{children}</span>
);

const Tooltip = ({ tipText }: { tipText: string }) => (
  <div className={s.tooltip} title={tipText}>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        opacity="0.3"
        d="M6.99984 12.8332C10.2215 12.8332 12.8332 10.2215 12.8332 6.99984C12.8332 3.77818 10.2215 1.1665 6.99984 1.1665C3.77818 1.1665 1.1665 3.77818 1.1665 6.99984C1.1665 10.2215 3.77818 12.8332 6.99984 12.8332Z"
        stroke="#051626"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.3"
        d="M7 9.33333V7"
        stroke="#051626"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.3"
        d="M7 4.6665H7.00667"
        stroke="#051626"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

function textFormatter(txt: string) {
  const km2Ind = txt.indexOf('km2');
  if (km2Ind !== -1) {
    const strLeft = txt.substring(0, km2Ind - 1);
    const strRight = txt.substring(km2Ind + 3);
    return (
      <>
        {strLeft}km<Sub>2</Sub>
        {strRight}
      </>
    );
  }
}

export const AnalyticsDataList = ({ data, links }: AnalyticsDataListProps) => {
  return (
    <>
      {data &&
        data.map((dataItem, index) => (
          <div key={`${dataItem.name}_${index}`} className={s.stat}>
            <div className={s.statHead}>
              {dataItem.name}
              <Tooltip tipText={dataItem.description} />
            </div>
            <div className={s.statContent}>
              {dataItem.percentValue && (
                <>
                  {dataItem.percentValue}%
                  <span className={s.statSplitter}>|</span>
                </>
              )}
              {textFormatter(dataItem.text)}
            </div>
          </div>
        ))}
      {links && links.length ? (
        <div className={s.stat}>
          <div className={s.statHead}>{t.t('Details')}</div>
          <div className={s.statContent}>
            {links.map((link) => (
              <a
                className={s.link}
                href={link}
                key={link}
                target="_blank"
                rel="noreferrer"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};
