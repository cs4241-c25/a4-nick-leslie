import { createSignal, type Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { Route, Router } from '@solidjs/router';
import { Home } from './routes/home';
import { Layout } from './routes/layout';
import { group } from './routes/group';

const App: Component = () => {
  return (
    <Router root={Layout}>
      <Route component={Home}/>
      <Route path={"/group/:group_id"} component={group}/>
    </Router>
  );
};

export default App;
