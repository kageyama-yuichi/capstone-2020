import React, { Component } from 'react';
import BodyComponent from './components/client/BodyComponent'
import './App.css';
//import './bootstrap.css';

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
