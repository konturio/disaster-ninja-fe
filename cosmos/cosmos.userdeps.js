// This file is automatically generated by Cosmos. Add it to .gitignore and
// only edit if you know what you're doing.

// Keeping global imports here is superior to making them bundle entry points
// because this way they become hot-reloadable.
import './../node_modules/@konturio/default-theme/variables.css';
import './../node_modules/@konturio/default-theme/defaults.css';
import './../node_modules/@konturio/default-theme/typography.css';

import fixture0 from './../src/features/bivariate_manager/components/BivariateMatrixControl/react-cosmos/BivariateMatrixControl.fixture.tsx';

import decorator0 from './../cosmos.decorator.tsx';
import decorator1 from './../src/cosmos.decorator.tsx';

export const rendererConfig = {
  port: 5000,
};

export const fixtures = {
  'src/features/bivariate_manager/components/BivariateMatrixControl/react-cosmos/BivariateMatrixControl.fixture.tsx':
    { module: { default: fixture0 } },
};

export const decorators = {
  'cosmos.decorator.tsx': decorator0,
  'src/cosmos.decorator.tsx': decorator1,
};
