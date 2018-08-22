import React, { Component } from 'react';
import { Header, FirstStep, SecondStep, ThirdStep, FourthStep, FifthStep, Retry, Welcome } from './components';
import { Route, Redirect } from 'react-router-dom';
import { inject } from "mobx-react";
import './assets/stylesheets/application.css';

const PrivateRoute = ({ component: Component, startedUrl, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      startedUrl === '#/' || startedUrl === '#/1' ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/"
          }}
        />
      )
    }
  />
);

@inject("UiStore")
export class App extends React.Component {
  constructor(props){
    super(props);
    this.web3Store = props.UiStore.web3Store;
  }
  render(){
    let startedUrl = this.web3Store.startedUrl
    console.log('fix eth multisend')
    return (
      <div>
        <Header />
        <Route exact path="/" component={FirstStep}/>
        <Route exact path="/1" component={FirstStep}/>
        <PrivateRoute path="/2" component={SecondStep} startedUrl={startedUrl} />
        <PrivateRoute exact path="/2" component={SecondStep} startedUrl={startedUrl}/>
        <PrivateRoute exact path="/3" component={ThirdStep} startedUrl={startedUrl}/>
        <PrivateRoute exact path="/4" component={FourthStep} startedUrl={startedUrl}/>
        <PrivateRoute exact path="/5" component={FifthStep} startedUrl={startedUrl}/>
        {/* <Route exact path="/retry" component={Retry}/> */}
      </div>
    );
  }
}