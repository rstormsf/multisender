import React from 'react';
import Web3Utils from 'web3-utils';
import Form from 'react-validation/build/form';
import Textarea from 'react-validation/build/textarea';
import Button from 'react-validation/build/button';
import { form, control, button } from 'react-validation';
import { inject, observer } from "mobx-react";
import swal from 'sweetalert';
import generateElement from '../generateElement'
import Example from './example.json'
import { PulseLoader} from 'react-spinners';
import {RadioGroup, Radio} from 'react-radio-group';
import csvtojson from 'csvtojson'
import Select from 'react-select'
import '../assets/stylesheets/react-select.min.css';


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
    this.web3Store.setStartedUrl('#/');
    this.onTokenAddress = this.onTokenAddress.bind(this);
    this.onDecimalsChange = this.onDecimalsChange.bind(this);
    this.onJsonChange = this.onJsonChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state ={
      format: '',
      placeholder: JSON.stringify(Example),
      tokenAddress: {label: '', value: null}
    }
    this.onSelectFormat = this.onSelectFormat.bind(this)
    this.onParse = this.onParse.bind(this)
    this.parseCompleted = false;
    this.list = [];
  }
  async onTokenAddress(e){
    if(!e){
      this.setState({tokenAddress: {label: '', value: ''}})
      return
    }
    const address = e.value;
    if (Web3Utils.isAddress(address)) {
        this.tokenStore.setTokenAddress(address);
        this.setState({tokenAddress: {label: e.label, value: e.value}})
    }
  }
  onSelectFormat(newFormat){
    if(newFormat === 'csv'){
      this.setState({format: newFormat, placeholder: `
0xCBA5018De6b2b6F89d84A1F5A68953f07554765e,12
0xa6Bf70bd230867c870eF13631D7EFf1AE8Ab85c9,1123.45645
0x00b5F428905DEA1a67940093fFeaCeee58cA91Ae,1.049
0x00fC79F38bAf0dE21E1fee5AC4648Bc885c1d774,14546
  `})
    swal("Information", `Please provide CSV file in comma separated address,balance format one line per address.
    \nExample:\n 
0xCBA5018De6b2b6F89d84A1F5A68953f07554765e,12
0xa6Bf70bd230867c870eF13631D7EFf1AE8Ab85c9,113.45
0x00b5F428905DEA1a67940093fFeaCeee58cA91Ae,1.049
0x00fC79F38bAf0dE21E1fee5AC4648Bc885c1d774,14546
    `, 'info')
    } else {
      this.setState({format: newFormat, placeholder: JSON.stringify(Example)})
      swal({
        content: generateElement(`<div style="color:black;">
        Please provide JSON-array file in the following format.
        \nExample:\n 
        <div style="font-size: 12px;color:purple;">
        [<br/>
          {"0xCBA5018De6b2b6F89d84A1F5A68953f07554765e":"12"},
          {"0xa6Bf70bd230867c870eF13631D7EFf1AE8Ab85c9":"1123.45645"},
          {"0x00b5F428905DEA1a67940093fFeaCeee58cA91Ae":"1.049"},
          {"0x00fC79F38bAf0dE21E1fee5AC4648Bc885c1d774":"14546"}
          <br/>]
        </div>
        </div>
        `),
        icon: 'info'
      })
      
    }
  }
  onDecimalsChange(e) {
    this.tokenStore.setDecimals(e.target.value)
  }

  onJsonChange(value) {
    try {
      let addresses = JSON.parse(value);
      this.tokenStore.setJsonAddresses(addresses)
      this.parseCompleted = true;
    } catch(e) {
      const error = e.message.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
      console.error(error)
      swal({
        content: generateElement(`${error} Please visit <a target="_blank" href="https://jsonlint.com">JsonLint.com</a>`),
        icon: "error",
      })
    }
  }

  async onCsvChange(value){
    return new Promise((res, rej) => {
      let addresses = [];
      console.log(value)
      csvtojson({noheader:true})
      .fromString(value)
        .on('csv',(csv)=>{
          let el = {};
          if(csv.length === 2){
            Object.defineProperty(el, csv[0], {
              value: csv[1],
              writable: true,
              configurable: true,
              enumerable: true,
            });
            addresses.push(el)
          } 
        })
        .on('end', () => {
          try {
            console.log('csv is done')
            this.parseCompleted = true;
            this.tokenStore.setJsonAddresses(addresses)
            res(addresses);
          } catch(e) {
            console.error(e)
            rej(e);
            swal({
              content: "Your CSV is invalid",
              icon: "error",
            })
          }
        })
    })
  }

  onParse(e){
    this.list = e.target.value;
    if(this.state.format === 'json') {
      this.onJsonChange(e.target.value)
    }
    if(this.state.format === 'csv'){
      this.onCsvChange(e.target.value)
    }
    return
  }
  async onSubmit(e){
    e.preventDefault()
    if(this.state.format === ''){
      swal("Error!", "Please select format CSV or JSON", 'error')
      return
    }
    console.log('onSubmit', this.parseCompleted, this.state.format)
    if(!this.parseCompleted){
      if(this.state.format === 'json') {
        this.onJsonChange(this.list)
      } else {
        await this.onCsvChange(this.list)
      }
    }
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
            Please provide Token Address, JSON/CSV file with addresses <br />
            This Dapp supports Mainnet, POA-Core, POA-sokol, Ropsten, Rinkeby, Kovan <br/>
            Please wait while all your token balances are loaded
          </p>
          <Form className="form" onSubmit={this.onSubmit}>
            <div className="form-inline">
              <div className="form-inline-i form-inline-i_token-address">
                <label htmlFor="token-address" className="label">Token Address</label>
                <Select.Creatable
              
              isLoading={this.web3Store.loading}
              name="form-field-name"
              id="token-address"
              value={this.state.tokenAddress}
              onChange={this.onTokenAddress}
              loadingPlaceholder="Loading your token addresses..."
              placeholder="Please select a token or input the address"
              options={this.web3Store.userTokens.slice()}
            />
                
              </div>
              <div className="form-inline-i form-inline-i_token-decimals">
                <label htmlFor="token-decimals" className="label">Decimals</label>
                <Input disabled={this.web3Store.loading} type="number" validations={[required]} onChange={this.onDecimalsChange} value={this.tokenStore.decimals} className="input" id="token-decimals"/>
              </div>
            </div>
            <label htmlFor="addresses-with-balances" className="label">Addresses with Balances in
            <RadioGroup name="format" selectedValue={this.state.format} onChange={this.onSelectFormat}>
              <Radio value="json" />JSON
              <Radio value="csv" />CSV
            </RadioGroup>
            
            </label>
            <Textarea 
              disabled={this.web3Store.loading}
              data-gram 
              validations={[required]}
              placeholder={`Example: ${this.state.placeholder}`}
              onBlur={this.onParse} id="addresses-with-balances" className="textarea"></Textarea>
            <Button className="button button_next">Next</Button>
          </Form>
        </div>
      </div>
    );
  }
}