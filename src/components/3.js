import React from 'react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view'
import { inject, observer } from "mobx-react";
import BN from 'bignumber.js'
import swal from 'sweetalert';
import Select from 'react-select';

@inject("UiStore")
@observer
export class ThirdStep extends React.Component {
  constructor(props){
    super(props);
    this.tokenStore = props.UiStore.tokenStore;
    this.gasPriceStore = props.UiStore.gasPriceStore;
    console.log(this.gasPriceStore.gasPricesArray)
    this.onNext = this.onNext.bind(this)
    this.state = {
      gasPrice: ''
    }
  }
  componentDidMount() {
    if(this.tokenStore.dublicates.length > 0){

      swal({
        title: `There were duplicated eth addresses in your list.`,
        text: `${JSON.stringify(this.tokenStore.dublicates.slice(), null, '\n')}.\n Multisender already combined the balances for those addreses. Please make sure it did the calculation correctly.`,
        icon: "warning",
      })
    }
  }
  onNext(e) {
    e.preventDefault();
    if (new BN(this.tokenStore.totalBalance).gt(new BN(this.tokenStore.defAccTokenBalance))){
      console.error('Your balance is more than total to send')
      swal({
        title: "Insufficient token balance",
        text: `You don't have enough tokens to send to all addresses.\nAmount needed: ${this.tokenStore.totalBalance} ${this.tokenStore.tokenSymbol}`,
        icon: "error",
      })
      return
    }
    if( new BN(this.tokenStore.totalCostInEth).gt(new BN(this.tokenStore.ethBalance))){
      console.error('please fund you account in ')
      swal({
        title: "Insufficient ETH balance",
        text: `You don't have enough ETH to send to all addresses. Amount needed: ${this.tokenStore.totalCostInEth} ETH`,
        icon: "error",
      })
      return
    }
    this.props.history.push('/4')
  }

  onGasPriceChange = (selected) => {
    if(selected){
      this.gasPriceStore.setSelectedGasPrice(selected.value)
    }
  }
  render() {
    return (
      <div className="container container_bg">
        <div className="content">
          <h1 className="title"><strong>Welcome to Token</strong> MultiSender</h1>
          <p className="description">
          Please provide Token Address, JSON file with addresses <br />
          This Dapp supports Mainnet, POA-Core, POA-sokol, Ropsten, Rinkeby, Kovan
          </p>
          <form className="form">
            <ReactJson displayDataTypes={false}
              style={{backgroundColor: 'none'}}
              indentWidth="2"
              iconStyle="square"
              name={false}
              theme="solarized"
              src={this.tokenStore.jsonAddresses.slice()} />
              <div style={{padding: "25px 0px"}}>
                <p>Network Speed (Gas Price)</p>
                <Select.Creatable
                  isLoading={this.gasPriceStore.loading}
                  value={this.gasPriceStore.selectedGasPrice}
                  onChange={this.onGasPriceChange}
                  loadingPlaceholder="Fetching gas Price data ..."
                  placeholder="Please select desired network speed"
                  options={this.gasPriceStore.gasPricesArray.slice()}
                />
              </div>
            <div className="send-info">
              <div className="send-info-side">
                <div className="send-info-i">
                  <p>Total Tokens to be Sent</p>
                  <p className="send-info-amount">{this.tokenStore.totalBalance} {this.tokenStore.tokenSymbol}</p>
                </div>
                <div className="send-info-i">
                  <p>Your Balance</p>
                  <p className="send-info-amount">{this.tokenStore.defAccTokenBalance} {this.tokenStore.tokenSymbol}</p>
                </div>
                <div className="send-info-i">
                  <p>Your Contract's Current fee Per tx</p>
                  <p className="send-info-amount">{this.tokenStore.currentFee} ETH</p>
                </div>
                <div className="send-info-i">
                  <p>Your ETH Balance</p>
                  <p className="send-info-amount">{this.tokenStore.ethBalance}</p>
                </div>
              </div>
              <div className="send-info-side">
                <div className="send-info-i">
                  <p>Total Addresses in the Array</p>
                  <p className="send-info-amount">{this.tokenStore.jsonAddresses.length}</p>
                </div>
                <div className="send-info-i">
                  <p>Current Allowance</p>
                  <p className="send-info-amount">{this.tokenStore.allowance} {this.tokenStore.tokenSymbol}</p>
                </div>
                <div className="send-info-i">
                  <p>Total Number of tx Needed</p>
                  <p className="send-info-amount">{this.tokenStore.totalNumberTx}</p>
                </div>
                <div className="send-info-i">
                  <p>Approximate Cost of Operation</p>
                  <p className="send-info-amount">
                  {this.tokenStore.totalCostInEth} ETH        
                  </p>
                </div>
                <div className="send-info-i">
                  <p>Selected Network speed (Gas Price)</p>
                  <p className="send-info-amount">
                  {this.gasPriceStore.selectedGasPrice} gwei
                  </p>
                </div>
              </div>
            </div>
            
            <Link onClick={this.onNext} className="button button_next" to='/4'>Next</Link>
          </form>
        </div>
      </div>
    );
  }
}