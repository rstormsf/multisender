import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { HashRouter } from 'react-router-dom';
import { Provider } from "mobx-react";
import UiStore from "./stores/UiStore";

const Root = (
  <Provider UiStore={UiStore}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);
ReactDOM.render(Root, document.getElementById('root'));
