import React, { Component } from 'react';
import BodyComponent from './components/Routes/BodyComponent'
import './App.css';
import './BootstrapCustom.scss';


class App extends Component {
  // constructor() {
  //   super()
  //   //Load google maps javascript library
  //   const script = window.document.createElement("script");
	// 	script.src =
	// 		"https://maps.googleapis.com/maps/api/js?key=" +
	// 		process.env.REACT_APP_PLACES_API_KEY +
	// 		"&libraries=places";
	// 	script.id = "mapsLibrary";
	// 	document.body.appendChild(script);
  // }

  render() {
    return (
      <div className="App">
		    <BodyComponent />
      </div>
    );
  }
}

export default App;
