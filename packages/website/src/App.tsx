import React from 'react';
import * as firebase from './Firebase';
import TopBar from './components/TopBar';

firebase.analytics();

const App: React.FC = () => {
  return (
    <>
      <TopBar />
    </>
  );
};

export default App;
