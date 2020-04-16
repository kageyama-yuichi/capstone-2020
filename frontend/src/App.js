import React, { Component } from 'react';
import BodyComponent from './components/Routes/BodyComponent'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
