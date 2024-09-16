import { Panel } from '@konturio/ui-kit';
import { useCallback, useState } from 'react';
import Breadcrumbs from '../Breadcrumbs';
import s from './style.module.css';

const ITEMS_PLACEHOLDER = [
  { label: 'Country 1', value: 'Country 1' },
  { label: 'Administrative unit 2', value: 'Administrative unit 2' },
  { label: 'Administrative unit 3', value: 'Administrative unit 3' },
  { label: 'Administrative unit 4', value: 'Administrative unit 4' },
  { label: 'City 5', value: 'City 5' },
  { label: 'District 6', value: 'District 6' },
  { label: 'District 7', value: 'District 7' },
  { label: 'Administrative unit 8', value: 'Administrative unit 8' },
  { label: 'Administrative unit 9', value: 'Administrative unit 9' },
  { label: 'Administrative unit 10', value: 'Administrative unit 10' },
  { label: 'Administrative unit 11', value: 'Administrative unit 11' },
];

// const ITEMS_PLACEHOLDER_2 = [
//   { label: 'Country 11', value: 'Country 1' },
//   { label: 'Administrative unit 12', value: 'Administrative unit 2' },
//   { label: 'Administrative unit 13', value: 'Administrative unit 3' },
//   { label: 'Administrative unit 14', value: 'Administrative unit 4' },
//   { label: 'City 15', value: 'City 15' },
//   { label: 'District 16', value: 'District 6' },
//   { label: 'District 17', value: 'District 7' },
//   { label: 'Administrative unit 18', value: 'Administrative unit 8' },
//   { label: 'Administrative unit 19', value: 'Administrative unit 9' },
//   { label: 'Administrative unit 110', value: 'Administrative unit 10' },
// ];

const BreadcrumbsPanel = () => {
  const [activeCrumb, setActiveCrumb] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(
    ITEMS_PLACEHOLDER.length - 1,
  );
  const [items, setItems] = useState(ITEMS_PLACEHOLDER);

  const handleClick = useCallback(
    (value: string, index: number) => {
      // console.log('handleClick', value, index, activeIndex);
      // if (!activeIndex) {
      //   setActiveCrumb(value);
      //   setActiveIndex(index);
      // }

      // if (activeIndex) {
      //   console.log('clear');
      //   setActiveCrumb(null);
      //   setActiveIndex(null);
      //   setItems((oldItems) => oldItems === ITEMS_PLACEHOLDER ? ITEMS_PLACEHOLDER_2 : ITEMS_PLACEHOLDER);
      // }
      setItems((oldItems) => oldItems.slice(0, index + 1));
      setActiveCrumb(value);
      setActiveIndex(index);
    },
    [activeIndex, items],
  );

  return (
    <Panel resize="none">
      <Breadcrumbs
        active={activeCrumb}
        activeIndex={activeIndex}
        items={items}
        onClick={handleClick}
      />
    </Panel>
  );
};

export default BreadcrumbsPanel;
