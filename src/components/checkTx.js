import React from 'react';
import { Link } from 'react-router-dom';
import Web3Utils from 'web3-utils';
import Form from 'react-validation/build/form';
import Textarea from 'react-validation/build/textarea';
import Button from 'react-validation/build/button';
import { form, control, button } from 'react-validation';
import { inject, observer } from "mobx-react";
import swal from 'sweetalert';
import generateElement from '../generateElement'
import Example from './example.json'
import ExampleCSV from './example.csv'
import { PulseLoader} from 'react-spinners';
import {RadioGroup, Radio} from 'react-radio-group';
import csvtojson from 'csvtojson'
import Select from 'react-select'
import '../assets/stylesheets/react-select.min.css';
import StormMultiSenderABI from '../abis/StormMultisender'

const InputDataDecoder = require('ethereum-input-data-decoder');
const decoder = new InputDataDecoder(StormMultiSenderABI);

const ownInput = ({ error, isChanged, isUsed, ...props }) => (
  <div>
    {isChanged && isUsed && error}
    <input {...props} />
  </div>
);
const Input = control(ownInput);

const required = (value) => {
  if (!value.toString().trim().length) {
    return <span className="error">required</span>;
  }
};

const isAddress = (value) => {
  if (!Web3Utils.isAddress(value)) {
    return <span className="error">Token address is invalid</span>;
  }
};
const InvalidJSON = <div>Your JSON is invalid, please visit <a href="https://jsonlint.com/" target="_blank">Online Json Validator</a></div>

const isJson = (value) => {
  try {
    JSON.parse(value)
  } catch(e) {
    return InvalidJSON
  }
};


@inject("UiStore")
@observer
export class CheckTx extends React.Component {
  constructor(props){
    super(props);
    this.tokenStore = props.UiStore.tokenStore;
    this.txStore = props.UiStore.txStore;
    this.web3Store = props.UiStore.web3Store;
    this.onTxHash = this.onTxHash.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addresses = []
    this.tokenAddress = '';
    this.txFailed = true;
  }
  async onTxHash(e){

    const status =  await this.txStore.checkTransaction(e.value);
    if (status == -1)
    {
      swal({
        content: "Your tx hash is invalid",
        icon: "error",
      })
      return;
    }
    if (!status.isError)
    {
      swal({
        content: "Transaction is succeded",
        icon: "success",
      })
      return;
    }

    swal({
      content: status.description,
      icon: "error",
    })

    const inputData = decoder.decodeData(status.inputData);
    const tokenAddress = `0x${inputData.inputs[0]}`;
    const addresses = []
    const recAddresses = inputData.inputs[1];
    const balances = inputData.inputs[2];
    let bindex = 0;

    recAddresses.forEach((address)=>{
      const addr = {};
      addr[`0x${address}`] = Web3Utils.BN(balances[bindex]);
      addresses.push(addr);
      bindex++;
    });
    await this.tokenStore.setJsonAddresses(addresses);
    await this.tokenStore.setTokenAddress(tokenAddress);
    this.txFailed = true;
  }
  onSubmit(e){
    e.preventDefault()

    this.tokenStore.setDecimals(0)
    this.tokenStore.parseAddresses()
    this.props.history.push('/3')
  }
  render () {
    const txFailed = this.txFailed;
    return (
      <div className="container container_bg">

        <div className="content">
          <div className='sweet-loading'>
          <PulseLoader
            color={'#123abc'}
            loading={this.web3Store.loading}
            />
          </div>
          <h1 className="title"><strong>Check transaction status</strong></h1>
          <p className="description">
            Please provide tx hash <br />
          </p>
          <Form className="form" onSubmit={this.onSubmit}>
            <div className="form-inline">
              <div className="form-inline-i form-inline-i_token-address">
                <label htmlFor="tx-hash" className="label">Tx Hash</label>
                <Select.Creatable

              isLoading={this.web3Store.loading}
              name="form-field-name"
              id="tx-hash"
              onChange={this.onTxHash}
              loadingPlaceholder="Checking your transaction..."
              placeholder="Please select or input the tx hash"
              options={this.web3Store.userTokens.slice()}
            />

              </div>
            </div>
            <br/>
            <Button className="button button_check" disabled>Resend Transaction</Button>
          </Form>
        </div>
      </div>
    );
  }
}
