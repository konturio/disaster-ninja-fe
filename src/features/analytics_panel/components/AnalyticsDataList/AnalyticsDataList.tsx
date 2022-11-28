import ReactMarkdown from 'react-markdown';
import { nanoid } from 'nanoid';
import { i18n } from '~core/localization';
import { Tooltip } from '~components/Tooltip';
import { parseLinksAsTags } from '~utils/markdown/parser';
import { getShortLinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import s from './AnalyticsData.module.css';
import type { AnalyticsData } from '~core/types';

interface AnalyticsDataListProps {
  data?: AnalyticsData[] | null;
  links?: string[];
}

const Sub = ({ children }) => (
  <span style={{ fontSize: '.7em', verticalAlign: 'super' }}>{children}</span>
);

function textFormatter(txt: string) {
  const km2Ind = txt.indexOf('km2');
  if (km2Ind !== -1) {
    const strLeft = txt.substring(0, km2Ind - 1);
    const strRight = txt.substring(km2Ind + 3);
    return (
      <>
        {strLeft} km<Sub>2</Sub>
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
              <Tooltip tipText={dataItem.description} showedOnHover={true} />
            </div>
            <div className={s.statContent}>
              {typeof dataItem.percentValue !== 'undefined' ? (
                <>
                  {dataItem.percentValue}%<span className={s.statSplitter}>|</span>
                </>
              ) : null}
              {textFormatter(dataItem.text)}
            </div>
          </div>
        ))}
      {links && links.length ? (
        <div className={s.stat}>
          <div className={s.statHead}>{i18n.t('details')}</div>
          <div className={s.statContent}>
            {links.map((link) => (
              <ReactMarkdown
                components={{ a: getShortLinkRenderer() }}
                className={s.markdown}
                key={nanoid(4)}
              >
                {parseLinksAsTags(link)}
              </ReactMarkdown>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};
