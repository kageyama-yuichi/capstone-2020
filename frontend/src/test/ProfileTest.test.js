import React from 'react';
import { shallow } from 'enzyme';
import ProfileComponent from '../components/Profile/ProfileComponent';

	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<ProfileComponent />);
	});

    describe('Profile component tests', ()=> {
		
		it('Should render Profile components', ()=> {
            //First test to check if it renders with no problem
           expect(wrapper).not.toBe(null)
        });

        it('should have an image upload type', ()=> {
            //Uploading picture input should be there
            expect(wrapper.find('input[type="file"]')).toHaveLength(1);
        });
		
		it('should have an input to change first name and last name', ()=> {
            //Input for first name and last name should be there
			expect(wrapper.find({ className: 'fName-input' })).toHaveLength(1);
			expect(wrapper.find({ className: 'lName-input input-field' })).toHaveLength(1);
        });
		
		it('should have an input to change address', ()=> {
            //Input for address should be there
			expect(wrapper.find({ className: 'address-container' })).toHaveLength(1);
        });
		
		it('should have an input to change bio', ()=> {
            //Input for bio should be there
			expect(wrapper.find({ name: 'bio' })).toHaveLength(1);
        });
		
		it('should have profile update submit button', ()=> {
            //Submit form button should be present
            expect(wrapper.find('Button[type="submit"]')).toHaveLength(1);
        });
		
		it('Firstname input check',()=> {
			wrapper.find({ className: 'fName-input' }).simulate('change', {target: {name: 'firstname', value: 'Rick'}});
			expect(wrapper.state('firstname')).toEqual('Rick');
		});
		
		it('Lastname input check',()=> {
			wrapper.find({ className: 'lName-input input-field' }).simulate('change', {target: {name: 'lastname', value: 'Ross'}});
			expect(wrapper.state('lastname')).toEqual('Ross');
		});
		
		/*
		it('Bio input check',()=> {
			wrapper.find({ className: 'bio-container' }).simulate('change', {target: {name: 'bio', value: 'This is a test'}});
			expect(wrapper.state('bio')).toEqual('This is a test');
		});
		*/
        
		
		 
		
		
  });