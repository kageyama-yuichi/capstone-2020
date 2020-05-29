import React from 'react';
import { shallow } from 'enzyme';
import TodoComponent from '../components/Todo/TodoComponent';

	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<TodoComponent />);
	});

      describe('Todo component tests', ()=> {
		
		it('Renders page components', ()=> {
            //First test to check if it renders with no problem
            expect(wrapper).not.toBe(null)
        });

      it('should have a new todo button', ()=> {
            //New to do button should be present
            expect(wrapper.find('Button').text()).toEqual('New Todo')
                
        });
        
        

  });