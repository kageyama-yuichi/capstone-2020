import React, { Component } from 'react';
import BodyComponent from './components/Routes/BodyComponent'
import dotenv from 'dotenv';
import './App.css';
import './BootstrapCustom.scss';


class App extends Component {

	render() {
		return (
			<div className="App">
				<BodyComponent />
			</div>
		);
	}
}

export default App;
