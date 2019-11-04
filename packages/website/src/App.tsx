import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as firebase from 'firebase/app';
import './FirebaseInit';
import TopBar from './components/TopBar';
import Home from './routes/Home';
import Login from './routes/Login';
import { CircularProgress, Container } from '@material-ui/core';

firebase.analytics();

const App: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      setReady(true);
    });

    return unsubscribe;
  }, []);

  return (
    <Router>
      <TopBar user={user} />
      {ready ? (
        <Switch>
          <Route path="/login">
            <Login user={user} />
          </Route>
          <Route path="/">
            <Home user={user} />
          </Route>
        </Switch>
      ) : (
        <Container maxWidth="xs">
          <CircularProgress />
        </Container>
      )}
    </Router>
  );
};

export default App;
