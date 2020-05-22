import React from 'react';
import { shallow } from 'enzyme';
import PasswordChangeComponent from '../components/PasswordChange/PasswordChangeComponent';
	
	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<PasswordChangeComponent />);
	});
	
	it('Should render passwordchange components', ()=> {
            //First test to check if it renders with no problem
           expect(wrapper).not.toBe(null);
        });