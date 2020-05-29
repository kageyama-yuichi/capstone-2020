import React from 'react';
import { shallow } from 'enzyme';
import DashboardComponent from '../components/Dashboard/DashboardComponent';

	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<DashboardComponent />);
	});

      describe('Dashboard component tests', ()=> {
		
		it('Renders page components', ()=> {
            //First test to check if it renders with no problem
            expect(wrapper).not.toBe(null)
        });
  });