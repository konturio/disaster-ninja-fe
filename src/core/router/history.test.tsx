/**
 * @vitest-environment happy-dom
 */
import * as React from 'react';
import { test, expect } from 'vitest';
import sinon from 'sinon';
import history from './history';
import { Router } from 'react-router-dom';
import { useHistory } from 'react-router';
import { fireEvent, render } from '@testing-library/react';

const TestRoute = () => {
  const history = useHistory();
  return (
    <div>
      <button onClick={() => history.push('/test')} />
    </div>
  );
};

test('~core/history obj is used inside <Router> correctly', async () => {
  const spy = sinon.spy(history, 'push');

  const { getByRole } = render(
    <Router history={history}>
      <TestRoute />
    </Router>,
  );

  fireEvent.click(getByRole('button'));
  expect(spy.callCount).toBe(1);
  expect(history.location.pathname).toBe('/test');
  spy.restore();
});
