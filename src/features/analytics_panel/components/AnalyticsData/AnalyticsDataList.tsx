import s from './AnalyticsData.module.css';
import { AnalyticsData } from '~appModule/types';

interface AnalyticsDataListProps {
  data?: AnalyticsData[] | null;
}

export const AnalyticsDataList = ({ data }: AnalyticsDataListProps) => {
  return (
    <>
      {data &&
        data.map((dataItem, index) => (
          <div key={`${dataItem.name}_${index}`} className={s.stat}>
            <div className={s.statHead}>{dataItem.name}</div>
            <div className={s.statDesc}>{dataItem.description}</div>
            <div className={s.statContent}>
              {dataItem.percentValue && (
                <>
                  {dataItem.percentValue}%
                  <span className={s.statSplitter}>|</span>
                </>
              )}
              {dataItem.text}
            </div>
          </div>
        ))}
    </>
  );
};
