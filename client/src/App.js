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
import Login from './components/Login';
import Register from './components/Register';
import Auth from './components/Auth';
import Redirect from './components/Redirect';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Auth Component={Home} />
        </Route>
        <Route path="/account">
          <Auth Component={Account} />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/:id/url">
          <Auth Component={Redirect} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
