/**
 * @vitest-environment happy-dom
 */
import { expect, test, describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import Map from './index';

const mockFitBounds = vi.fn();

vi.mock('maplibre-gl', () => ({
  default: {
    Map: function () {
      this.fitBounds = mockFitBounds;
      this.on = () => null;
    },
    getRTLTextPluginStatus: () => null,
  },
}));

describe('<MapboxMap />', () => {
  it('Should render with no errors', () => {
    const component = render(<Map style={''} accessToken={''} />);
    const wrapper = document.querySelector('div');
    expect(wrapper).not.toBeNull();
  });

  it('Should render with class name', () => {
    const className = 'SuperDuperClassName';
    const { container } = render(
      <Map style={''} accessToken={''} className={className} />,
    );
    expect(container.getElementsByClassName('SuperDuperClassName').length).toBe(
      1,
    );
  });

  test.todo('Should call fitBounds with bounds props');
  test.todo('Should call fitBounds with bounds and boundsOptions props');
});
