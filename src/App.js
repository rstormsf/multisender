import React, { Component } from 'react';
import { Header, FirstStep, SecondStep, ThirdStep, FourthStep, FifthStep } from './components';
import { Route } from 'react-router-dom';

import './assets/stylesheets/application.css';

export const App = () => {
  return (
    <div>
      <Header/>
      <Route exact path="/" component={FirstStep}/>
      <Route exact path="/2" component={SecondStep}/>
      <Route exact path="/3" component={ThirdStep}/>
      <Route exact path="/4" component={FourthStep}/>
      <Route exact path="/5" component={FifthStep}/>
    </div>
  );
};
