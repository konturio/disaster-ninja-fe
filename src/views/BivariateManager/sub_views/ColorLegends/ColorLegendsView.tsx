import { ColorLegendFilters } from '~features/bivariate_color_manager/components/ColorLegendFilters/ColorLegendFilters';
import { SentimentsListContainer } from '~features/bivariate_color_manager/components/SentimentsListContainer/SentimentsListContainer';
import { LegendWithMapContainer } from '~features/bivariate_color_manager/components/LegendWithMapContainer/LegendWithMapContainer';
import style from './ColorLegendsView.module.css';

export const ColorLegendsView = () => (
  <div className={style.ColorLegendContainer}>
    <div className={style.List}>
      <ColorLegendFilters />
      <SentimentsListContainer />
    </div>
    <LegendWithMapContainer />
  </div>
);
