import { createSignal, type Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { Route, Router } from '@solidjs/router';
import { Home } from './routes/home';
import { Layout } from './routes/layout';

const App: Component = () => {
  return (
    <Router root={Layout}>
      <Route component={Home}/>
    </Router>
  );
};

export default App;
