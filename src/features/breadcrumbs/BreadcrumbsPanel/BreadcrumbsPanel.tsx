import { Panel } from '@konturio/ui-kit';
import { useCallback, useState } from 'react';
import Breadcrumbs from '../Breadcrumbs';

const BreadcrumbsPanel = () => {
  const [activeCrumb, setActiveCrumb] = useState<string | null>(null);

  const handleClick = useCallback((value: string) => {
    setActiveCrumb(value);
  }, []);

  return (
    <Panel resize="none">
      <Breadcrumbs
        active={activeCrumb}
        items={[
          { label: 'Country 1', value: 'product1_0' },
          { label: 'Administrative unit 2', value: 'product2_1' },
          { label: 'Administrative unit 3', value: 'product3_2' },
          { label: 'Administrative unit 4', value: 'product3_4' },
          { label: 'City 5', value: 'product5_5' },
          { label: 'District 6', value: 'product6' },
        ]}
        onClick={handleClick}
      />
    </Panel>
  );
};

export default BreadcrumbsPanel;
