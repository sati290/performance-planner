import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import * as firebase from 'firebase/app';
import './FirebaseInit';
import TopBar from './components/TopBar';
import Loading from './components/Loading';
import Routes from './routes/Routes';

firebase.analytics();

type AppState = { ready: false } | { ready: true; user: firebase.User | null };

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({ ready: false });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setState({ ready: true, user });
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <CssBaseline />
      <Router>
        <TopBar user={state.ready ? state.user : null} />
        {state.ready ? <Routes user={state.user} /> : <Loading />}
      </Router>
    </>
  );
};

export default App;
