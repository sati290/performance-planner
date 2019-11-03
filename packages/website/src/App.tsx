import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import * as firebase from 'firebase/app';
import './FirebaseInit';
import TopBar from './components/TopBar';
import Home from './routes/Home';
import Login from './routes/Login';
import { Typography } from '@material-ui/core';

firebase.analytics();

const App: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setReady(true);
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return ready ? (
    <Router>
      <TopBar />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">{user ? <Home /> : <Redirect to="/login" />}</Route>
      </Switch>
    </Router>
  ) : (
    <Typography>Loading...</Typography>
  );
};

export default App;
