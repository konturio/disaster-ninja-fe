import { TooltipTrigger } from '~components/TooltipTrigger';
import s from './AnalyticsData.module.css';
import type { AnalyticsData } from '~core/types';

interface AnalyticsDataListProps {
  data?: AnalyticsData[] | null;
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

export const AnalyticsDataList = ({ data }: AnalyticsDataListProps) => {
  return (
    <>
      {data &&
        data.map((dataItem, index) => (
          <div key={`${dataItem.name}_${index}`} className={s.stat}>
            <div className={s.statHead}>
              {dataItem.name}
              <TooltipTrigger tipText={dataItem.description} showedOnHover={true} />
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
    </>
  );
};
