import React from 'react';
import Web3Utils from 'web3-utils';
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import { form, control, button } from 'react-validation';
import { inject, observer } from "mobx-react";
import swal from 'sweetalert';
import { PulseLoader} from 'react-spinners';
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
    this.txFailed = false;
  }
  async onTxHash(e){

    let status = {}

    try {
      status = await this.txStore.checkTransaction(e.value);
    } catch (e) {
      swal("Error!", e.message, "error")
      return;
    }

    if (!status.isError)
    {
      swal("Success", "Transaction is succeded", "success")
      return;
    }

    this.txFailed = true;
    swal("Error!", status.description, "error")

    const inputData = decoder.decodeData(status.inputData);
    const tokenAddress = `0x${inputData.inputs[0]}`;
    const addresses = []
    const recAddresses = inputData.inputs[1];
    const balances = inputData.inputs[2];
    let bindex = 0;

    await this.tokenStore.setTokenAddress(tokenAddress);
    const decimal = this.tokenStore.multiplier

    recAddresses.forEach((address)=>{
      const addr = {};
      addr[`0x${address}`] = Web3Utils.BN(balances[bindex]).div(decimal).toString(10)
      addresses.push(addr)
      bindex++
    });
    await this.tokenStore.setJsonAddresses(addresses);

    this.txFailed = true;
  }
  onSubmit(e){
    e.preventDefault()
    if (this.txFailed)
    {
      this.txStore.setAdditionalGas(5000)
      this.tokenStore.parseAddresses()
      this.props.history.push('/3')
    }
  }
  render () {

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
