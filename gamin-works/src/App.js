import React, { Component } from 'react';
import './App.css';
import AppContainer from './components/AppContainer';


class App extends Component {
  componentDidMount = () => {
    // if(window.location.href !== "http://localhost:3000/login")
    // window.location= "/login";
}
render() {
  return (
    <div className="App">
     
      <AppContainer/>
    </div>
  );
}
  
}

export default App;
