import React from 'react';
import { shallow } from 'enzyme';
import PasswordRecoveryComponent from '../components/PasswordRecovery/PasswordRecoveryComponent';
	
	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<PasswordRecoveryComponent />);
	});
	
	it('Should render passwordrecovery components', ()=> {
            //First test to check if it renders with no problem
           expect(wrapper).not.toBe(null);
        });
		
	it('should have an input for email', ()=> {
            //Input for email should be there
			expect(wrapper.find({ name: 'email' })).toHaveLength(1);
        });
		
	it('should have submit button for recovery', ()=> {
            //Submit form button should be present
            expect(wrapper.find('Button[type="submit"]')).toHaveLength(1);
        });