import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import * as firebase from 'firebase/app';
import './FirebaseInit';
import { State } from './store/types';
import { updateUser } from './store/actions';
import TopBar from './components/TopBar';
import Loading from './components/Loading';
import Routes from './routes';

firebase.analytics();
firebase.performance();

const App: React.FC = () => {
  const userPending = useSelector((state: State) => state.user.pending);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      dispatch(updateUser(user));
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <Router>
        <TopBar />
        {userPending ? <Loading /> : <Routes />}
      </Router>
    </>
  );
};

export default App;
