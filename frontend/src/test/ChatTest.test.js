import React from 'react';
import { shallow } from 'enzyme';
import ChatComponent from '../components/Chat/ChatComponent';

    describe('Chat component tests', ()=> {
        const wrapper = shallow(<ChatComponent />);
		
		it('Should render Chat components', ()=> {
            //First test to check if it renders with no problem
           expect(wrapper).not.toBe(null)
        });
  });