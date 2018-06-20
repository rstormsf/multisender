import React, { Component } from 'react';
import { Header, FirstStep, SecondStep, ThirdStep, FourthStep, FifthStep, Retry } from './components';
import { Route } from 'react-router-dom';
import './assets/stylesheets/application.css';

export class App extends React.Component {
  render(){
    return (
      <div>
        <Header/>
        <Route exact path="/" component={FirstStep}/>
        <Route exact path="/2" component={SecondStep}/>
        <Route exact path="/3" component={ThirdStep}/>
        <Route exact path="/4" component={FourthStep}/>
        <Route exact path="/5" component={FifthStep}/>
        {/* <Route exact path="/retry" component={Retry}/> */}
      </div>
    );
  }
}
