import React from 'react';
import './App.css';
import Navbar from './components/static/Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './components/Home';
import Account from './components/Account';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/account">
          <Account />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
