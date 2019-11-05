import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CircularProgress, Container } from '@material-ui/core';
import * as firebase from 'firebase/app';
import './FirebaseInit';
import TopBar from './components/TopBar';
import Routes from './routes/Routes';

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
        <Routes user={user} />
      ) : (
        <Container maxWidth="xs">
          <CircularProgress />
        </Container>
      )}
    </Router>
  );
};

export default App;
