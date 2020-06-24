import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AppContainer from './components/AppContainer';
import { Router, Route } from 'react-router-dom';

class App extends Component {
  componentDidMount = () => {
    // window.location= "/home";
}
render() {
  return (
    <div className="App">
      {/* <Router>
  <Route path = "/home" component={() => <AppContainer/>}/>
      </Router> */}
      <AppContainer/>
    </div>
  );
}
  
}

export default App;
