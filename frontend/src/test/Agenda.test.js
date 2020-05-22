import React from 'react';
import { shallow } from 'enzyme';
import AgendaComponent from '../components/Agenda/AgendaComponent';

	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<AgendaComponent />);
	});

      describe('Agenda component tests', ()=> {
		
		it('Renders page components', ()=> {
            //First test to check if it renders with no problem
            expect(wrapper).not.toBe(null)
        });

        it('Should render the application window', ()=> {
            //Should render the app window with no error
            expect(wrapper.find({ className: 'app-window' })).toHaveLength(1);	
        });
  });