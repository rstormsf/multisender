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
import Example from './example'
import { PulseLoader} from 'react-spinners';

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
export class FirstStep extends React.Component {
  constructor(props){
    super(props);
    this.tokenStore = props.UiStore.tokenStore;
    this.web3Store = props.UiStore.web3Store;
    this.onTokenAddress = this.onTokenAddress.bind(this);
    this.onDecimalsChange = this.onDecimalsChange.bind(this);
    this.onJsonChange = this.onJsonChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state ={
      json: []
    }
  }
  componentDidMount() {
    
  }
  async onTokenAddress(e){
    const address = e.target.value;
    if (Web3Utils.isAddress(address)) {
        this.tokenStore.setTokenAddress(address);
      // const decimals = await this.tokenStore.getDecimals(address);
    }
  }
  onDecimalsChange(e) {
    this.tokenStore.setDecimals(e.target.value)
  }
  onJsonChange(e) {
    try {
      let addresses = JSON.parse(e.target.value);
      console.log(addresses)
      this.tokenStore.setJsonAddresses(addresses)
    } catch(e) {
      const error = e.message.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
      console.error(error)
      swal({
        content: generateElement(`${error} Please visit <a target="_blank" href="https://jsonlint.com">JsonLint.com</a>`),
        icon: "error",
      })
    }
  }
  onSubmit(e){
    e.preventDefault()
    this.tokenStore.parseAddresses()
    this.props.history.push('/3')
  }
  render () {
    if(this.tokenStore.errors.length > 0){
      swal("Error!", this.tokenStore.errors.toString(), 'error')
    }
    if(this.web3Store.errors.length > 0){
      swal("Error!", this.web3Store.errors.toString(), 'error')
    }
    return (
      <div className="container container_bg">
          
        <div className="content">
          <div className='sweet-loading'>
          <PulseLoader
            color={'#123abc'} 
            loading={this.web3Store.loading} 
            />
          </div>
          <h1 className="title"><strong>Welcome to Token</strong> MultiSender</h1>
          <p className="description">
            Please provide Token Address, JSON file with addresses <br />
            This Dapp supports Mainnet, POA-Core, POA-sokol, Ropsten, Rinkeby, Kovan
          </p>
          <Form className="form" onSubmit={this.onSubmit}>
            <div className="form-inline">
              <div className="form-inline-i form-inline-i_token-address">
                <label htmlFor="token-address" className="label">Token Address</label>
                <Input disabled={this.web3Store.loading} validations={[required, isAddress]} onChange={this.onTokenAddress} type="text" className="input" id="token-address"/>
              </div>
              <div className="form-inline-i form-inline-i_token-decimals">
                <label htmlFor="token-decimals" className="label">Token Decimals</label>
                <Input disabled={this.web3Store.loading} type="number" validations={[required]} onChange={this.onDecimalsChange} value={this.tokenStore.decimals} className="input" id="token-decimals"/>
              </div>
            </div>
            <label htmlFor="addresses-with-balances" className="label">Addresses with Balances</label>
            <Textarea 
              disabled={this.web3Store.loading}
              data-gram 
              validations={[required, isJson]}
              placeholder={`Example: ${JSON.stringify(Example)}`}
              onBlur={this.onJsonChange} id="addresses-with-balances" className="textarea"></Textarea>
            <Button className="button button_next">Next</Button>
          </Form>
        </div>
      </div>
    );
  }
}