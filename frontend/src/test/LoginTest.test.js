import React from 'react';
import { shallow } from 'enzyme';
import LandingComponent from '../components/Landing/LandingComponent';
	
	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<LandingComponent />);
	});

    describe('Login component tests', ()=> {
		
		it('Should render login components', ()=> {
            //First test to check if it renders with no problem
           expect(wrapper).not.toBe(null);
        });
		

       it('should have input for username and password', ()=> {
            //Email and password input field should be present
            expect(wrapper.find('input[className="input-field username-field"]')).toHaveLength(1);
            expect(wrapper.find('input[className="input-field password-field"]')).toHaveLength(1);
        });
		
		it('should have a submit button', ()=> {
            //Submit form button should be present
            expect(wrapper.find('Button[type="submit"]')).toHaveLength(1);
        });
		
		it('Username input check',()=> {
			wrapper.find('input[type="text"]').simulate('change', {target: {name: 'username', value: 'Bob'}});
			expect(wrapper.state('username')).toEqual('Bob');
		});
		
		it('Password input check',()=> {
			wrapper.find('input[type="password"]').simulate('change', {target: {name: 'password', value: 'bobross123!'}});
			expect(wrapper.state('password')).toEqual('bobross123!');
		});
		
		
		

  });
	
	
	