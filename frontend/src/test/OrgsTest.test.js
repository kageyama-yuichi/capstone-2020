import React from 'react';
import { shallow } from 'enzyme';
import OrgsComponent from '../components/Orgs/OrgsComponent';

	let wrapper;
     
	beforeEach(() => {
		wrapper = shallow(<OrgsComponent />);
	});

    describe('Orgs component tests', ()=> {
		
		it('Should render orgs components', ()=> {
            //First test to check if it renders with no problem
          expect(wrapper).not.toBe(null)
        });
  });