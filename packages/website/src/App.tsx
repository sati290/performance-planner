import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import * as firebase from 'firebase/app';
import './FirebaseInit';
import { AppState } from './store/reducers';
import { authStateChanged } from './store/actions';
import { fetchUserData } from './store/thunks';
import TopBar from './components/TopBar';
import Loading from './components/Loading';
import Routes from './routes';

firebase.analytics();
firebase.performance();

const App: React.FC = () => {
  const authPending = useSelector((state: AppState) => state.auth.pending);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      dispatch(authStateChanged(user));
      dispatch(fetchUserData());
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <Router>
        <TopBar />
        {authPending ? <Loading /> : <Routes />}
      </Router>
    </>
  );
};

export default App;
