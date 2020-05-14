import React from 'react';
import { shallow } from 'enzyme';
import ContactComponent from '../components/Contacts/ContactComponent';

    describe('Chat component tests', ()=> {
        const wrapper = shallow(<ContactComponent />);
		
		it('Should render contact components', ()=> {
            //First test to check if it renders with no problem
           expect(wrapper).not.toBe(null)
        });

        it('should have field to search users', ()=> {
            //Should have input for finding users
            expect(wrapper.find({ id: 'search_user' })).toHaveLength(1);
        });
  });