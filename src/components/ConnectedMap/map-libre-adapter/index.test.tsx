export {};
// import Map from './index';
// import { shallow } from 'enzyme';

// const mockFitBounds = jest.fn();

// jest.mock('maplibre-gl/dist/maplibre-gl', () => ({
//   Map: () => ({
//     fitBounds: mockFitBounds,
//   }),
// }));

// describe('<MapboxMap />', () => {
//   it('Should render with no errors', () => {
//     const component = shallow(<Map style={''} accessToken={''} />);
//     const wrapper = component.find('div');
//     expect(wrapper.length).toBe(1);
//   });

//   it('Should render with class name', () => {
//     const className = 'SuperDuperClassName';
//     const component = shallow(<Map style={''} accessToken={''} className={className} />);
//     expect(component.find('div').hasClass(className)).toBe(true);
//   });

//   test.todo('Should call fitBounds with bounds props');
//   test.todo('Should call fitBounds with bounds and boundsOptions props');
// });
