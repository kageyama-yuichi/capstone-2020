import React from 'react';
import { shallow } from 'enzyme';
import RegisterComponent from '../components/Register/RegisterComponent';

	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<RegisterComponent />);
	});

    describe('Register component tests', ()=> {
		
		it('Should render register components', ()=> {
            //First test to check if it renders with no problem
            expect(wrapper).not.toBe(null);
        });

		
		it('should have input for firstname and lastname', ()=> {
            //Should have input for firstname
            expect(wrapper.find({ name: 'firstname' })).toHaveLength(1);
			//Should have input for lastname
			expect(wrapper.find({ name: 'lastname' })).toHaveLength(1);	
        });
		
		it('should have input for email', ()=> {
            //Should have input for email
            expect(wrapper.find('[type="email"]')).toHaveLength(1);
        });
		
		it('should have input for username and password', ()=> {
            //Should have input for username
            expect(wrapper.find('[name="username"]')).toHaveLength(1);
			//Should have input for password
			expect(wrapper.find('[name="password"]')).toHaveLength(1);
        });
		
		it('should have a submit button for register', ()=> {
            //Should have input for register
            expect(wrapper.find('[type="submit"]')).toHaveLength(1);
        });
  });