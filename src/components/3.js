import React from 'react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view'
import { inject, observer } from "mobx-react";

@inject("UiStore")
@observer
export class ThirdStep extends React.Component {
  constructor(props){
    super(props);
    this.tokenStore = props.UiStore.tokenStore;
  }
  render() {
    console.log('total', this.tokenStore.totalBalance)
    return (
      <div className="container container_bg">
        <div className="content">
          <h1 className="title"><strong>Welcome to Token</strong> MultiSender</h1>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore <a href="#">et dolore magna</a> aliqua.
          </p>
          <form className="form">
            <ReactJson displayDataTypes={false} style={{backgroundColor: 'none'}} indentWidth="2" iconStyle="square" name={false} theme="solarized" src={this.tokenStore.jsonAddresses.slice()} />
            <div className="send-info">
              <div className="send-info-side">
                <div className="send-info-i">
                  <p>Total Tokens to be Sent</p>
                  <p className="send-info-amount">{this.tokenStore.totalBalance}</p>
                </div>
                <div className="send-info-i">
                  <p>Your Balance</p>
                  <p className="send-info-amount">{this.tokenStore.defAccTokenBalance}</p>
                </div>
                <div className="send-info-i">
                  <p>Your Current fee Per tx</p>
                  <p className="send-info-amount">0.005 ETH</p>
                </div>
              </div>
              <div className="send-info-side">
                <div className="send-info-i">
                  <p>Total Addresses in the Array</p>
                  <p className="send-info-amount">{this.tokenStore.jsonAddresses.length}</p>
                </div>
                <div className="send-info-i">
                  <p>Current Allowance</p>
                  <p className="send-info-amount">0</p>
                </div>
                <div className="send-info-i">
                  <p>Total Number of tx Needed</p>
                  <p className="send-info-amount">6</p>
                </div>
              </div>
            </div>
            <Link className="button button_next" to='/4'>Start Processing</Link>
          </form>
        </div>
      </div>
    );
  }
}