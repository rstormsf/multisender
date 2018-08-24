import { action, observable, computed, autorun, toJS } from "mobx";
import Web3Utils from 'web3-utils'
import ERC20ABI from "../abis/ERC20ABI"
import MultiSenderAbi from "../abis/StormMultisender"
import Web3 from "web3";
import { observer } from "mobx-react";
import swal from 'sweetalert';
const BN = require('bignumber.js');


class TxStore {
  @observable txs = []
  txHashToIndex = {}
  @observable approval = '';
  constructor(rootStore) {
    this.tokenStore = rootStore.tokenStore
    this.web3Store = rootStore.web3Store
    this.gasPriceStore = rootStore.gasPriceStore
    this.interval = null;
  }

  @action
  async reset() {
    this.txs = []
    this.txHashToIndex = {}
    this.approval = '';
    this.keepRunning = false;
    clearInterval(this.interval);
  }

  @action
  async doSend(){
    this.keepRunning = true;
    this.txs = [];
    this.approval = '';
    if(new BN(this.tokenStore.totalBalance).gt(new BN(this.tokenStore.allowance))){
      this._approve();
      const interval = setInterval(() => {
        const index = this.txHashToIndex[this.approval];
        console.log('checking autorun', index, this.approval, this.txHashToIndex, toJS(this.txs))
        if(this.approval){
          if(this.txs[index] && this.txs[index].status === 'mined'){
            clearInterval(interval);
            console.log('lets GO!', this.tokenStore.totalNumberTx, this.tokenStore.arrayLimit)
            setTimeout(() => {
              this._multisend({slice: this.tokenStore.totalNumberTx, addPerTx: this.tokenStore.arrayLimit})
            }, 1000)
          }
        }
      }, 3000)
      this.interval = interval;
    } else {
      this._multisend({slice: this.tokenStore.totalNumberTx, addPerTx: this.tokenStore.arrayLimit})
    }
  }

  async _approve(){
    const index = this.txs.length;
    const web3 = this.web3Store.web3;
    const token = new web3.eth.Contract(ERC20ABI, this.tokenStore.tokenAddress);
    try{
      return token.methods['approve(address,uint256)'](this.tokenStore.proxyMultiSenderAddress, this.tokenStore.totalBalanceWithDecimals)
      .send({from: this.web3Store.defaultAccount, gasPrice: this.gasPriceStore.standardInHex})
      .on('transactionHash', (hash) => {
        this.approval = hash
        this.txHashToIndex[hash] = index;
        this.txs[index] = {status: 'pending', name: `MultiSender Approval to spend ${this.tokenStore.totalBalance} ${this.tokenStore.tokenSymbol}`, hash}
        this.getTxStatus(hash)
  
      })
      .on('error', (error) => {
        swal("Error!", error.message, 'error')
        console.error(error)
      })
    } catch (e){
      console.error(e)
    }
    
  }

  async _multisend({slice, addPerTx}) {
    if(!this.keepRunning){
      return
    }
    const token_address = this.tokenStore.tokenAddress
    let {addresses_to_send, balances_to_send, proxyMultiSenderAddress, currentFee, totalBalance} =  this.tokenStore;
    
    
    const start = (slice - 1) * addPerTx;
    const end = slice * addPerTx;
    addresses_to_send = addresses_to_send.slice(start, end);
    balances_to_send = balances_to_send.slice(start, end);
    let ethValue;
    if(token_address === "0x000000000000000000000000000000000000bEEF"){
      
      const totalInWei = balances_to_send.reduce((total, num) => {
        return (new BN(total).plus(new BN(num)))
      })
      const totalInEth = Web3Utils.fromWei(totalInWei.toString())
      ethValue = new BN(currentFee).plus(totalInEth)
    } else {
      ethValue = new BN(currentFee)
    }
    console.log('slice', slice, addresses_to_send[0], balances_to_send[0], addPerTx)
    const web3 = this.web3Store.web3;
    const multisender = new web3.eth.Contract(MultiSenderAbi, proxyMultiSenderAddress);

    try {
      let encodedData = await multisender.methods.multisendToken(token_address, addresses_to_send, balances_to_send).encodeABI({from: this.web3Store.defaultAccount})
      let gas = await web3.eth.estimateGas({
          from: this.web3Store.defaultAccount,
          data: encodedData,
          value: Web3Utils.toHex(Web3Utils.toWei(ethValue.toString())),
          to: proxyMultiSenderAddress
      })
      console.log('gas', gas)
      let tx = multisender.methods.multisendToken(token_address, addresses_to_send, balances_to_send)
      .send({
        from: this.web3Store.defaultAccount,
        gasPrice: this.gasPriceStore.standardInHex,
        gas: Web3Utils.toHex(gas + 150000),
        value: Web3Utils.toHex(Web3Utils.toWei(ethValue.toString())),
      })

      .on('transactionHash', (hash) => {
        this.txHashToIndex[hash] = this.txs.length
        this.txs.push({status: 'pending', name: `Sending Batch #${this.txs.length} ${this.tokenStore.tokenSymbol}\n
          From ${addresses_to_send[0]} to: ${addresses_to_send[addresses_to_send.length-1]}
        `, hash})
        this.getTxStatus(hash)
      })
      .on('error', (error) => {
        swal("Error!", error.message, 'error')
        console.log(error)
      })
      slice--;
      if (slice > 0) {
        this._multisend({slice, addPerTx});
      } else {
          
      }
    } catch(e){
      console.error(e)
    }
  }  

  async getTxReceipt(hash){
    console.log('getTxReceipt')
    try {
      const web3 = this.web3Store.web3;
      const res = await web3.eth.getTransaction(hash);
      return res;
    } catch(e) {
      console.error(e);
    }
  }

  async getTxStatus(hash) {
    console.log('GET TX STATUS', hash)
    if(!this.keepRunning){
      return
    }
    setTimeout(() => {
      const web3 = this.web3Store.web3;
      web3.eth.getTransactionReceipt(hash, (error, res) => {
        if(res && res.blockNumber){
          if(res.status === '0x1'){
            const index = this.txHashToIndex[hash]
            this.txs[index].status = `mined`
          } else {
            const index = this.txHashToIndex[hash]
            this.txs[index].status = `error`
            this.txs[index].name = `Mined but with errors. Perhaps out of gas`
          }
        } else {
          this.getTxStatus(hash)
        }
      })
    }, 3000)
  }

}

export default TxStore;