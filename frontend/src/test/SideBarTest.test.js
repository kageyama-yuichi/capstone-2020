import React from 'react';
import { shallow } from 'enzyme';
import SidebarComponent from '../components/Sidebar/SidebarComponent';
import { Link } from 'react-router';

	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<SidebarComponent />);
	});

	describe('Sidebar component tests', ()=> {
    
		it('Should render Sidebar components', ()=> {
            //First test to check if it renders with no problem
		    expect(wrapper).not.toBe(null)
        });
		
		
		
		//Pathing Check Tests later
		
		
  });