import { action, observable, computed } from "mobx";
import Web3Utils from 'web3-utils'
import ERC20ABI from "../abis/ERC20ABI"
import MultiSenderAbi from "../abis/StormMultisender"
import Web3 from "web3";
const BN = require('bignumber.js');

class TxStore {
  @observable txs = []
  txHashToIndex = {}
  constructor(rootStore) {
    this.tokenStore = rootStore.tokenStore
    this.web3Store = rootStore.web3Store
    this.gasPriceStore = rootStore.gasPriceStore
    // this._multisend = this._multisend.bind(this)
  }

  @action
  async doSend(){
    if(new BN(this.tokenStore.totalBalance).gt(new BN(this.tokenStore.allowance))){
      await this._approve()
    }
    this._multisend({slice: this.tokenStore.totalNumberTx, addPerTx: this.tokenStore.arrayLimit})
    console.log('doSend')
  }

  async _approve(){
    const index = this.txs.length;
    const web3 = this.web3Store.web3;
    const token = new web3.eth.Contract(ERC20ABI, this.tokenStore.tokenAddress);
    return token.methods['approve(address,uint256)'](this.tokenStore.proxyMultiSenderAddress, this.tokenStore.totalBalanceWithDecimals)
    .send({from: this.web3Store.defaultAccount, gasPrice: this.gasPriceStore.standardInHex})
    // .on('receipt', async (receipt) => {
    //   this.txs[index].status = `mined`
    //   console.log('receipt', receipt)
      
    // })
    .on('transactionHash', (hash) => {
      this.txHashToIndex[hash] = index;
      this.txs[index] = {status: 'pending', name: `MultiSender Approval to spend ${this.tokenStore.totalBalance} ${this.tokenStore.tokenSymbol}`, hash}
      console.log('txHash',hash)
      this.getTxReceipt(hash)

    })
    .on('error', (error) => {
      console.error(error)
    })
    
  }

  async _multisend({slice, addPerTx}) {
    const token_address = this.tokenStore.tokenAddress
    let {addresses_to_send, balances_to_send, proxyMultiSenderAddress, currentFee} =  this.tokenStore;
    currentFee = Web3Utils.toHex(Web3Utils.toWei(currentFee))
    const start = (slice - 1) * addPerTx;
    const end = slice * addPerTx;
    addresses_to_send = addresses_to_send.slice(start, end);
    balances_to_send = balances_to_send.slice(start, end);
    console.log('slice', slice, addresses_to_send[0], balances_to_send[0], addPerTx)
    const web3 = this.web3Store.web3;
    const multisender = new web3.eth.Contract(MultiSenderAbi, proxyMultiSenderAddress);
    console.log(addresses_to_send.length, balances_to_send.length)

    try {
      let encodedData = await multisender.methods.multisendToken(token_address, addresses_to_send, balances_to_send).encodeABI({from: this.web3Store.defaultAccount})
      let gas = await web3.eth.estimateGas({
          from: this.web3Store.defaultAccount,
          data: encodedData,
          value: currentFee,
          to: proxyMultiSenderAddress
      })
      let tx = multisender.methods.multisendToken(token_address, addresses_to_send, balances_to_send)
      .send({
        from: this.web3Store.defaultAccount,
        gasPrice: this.gasPriceStore.standardInHex,
        gas: Web3Utils.toHex(gas),
        value: currentFee
      })
      // .on('receipt', async (receipt) => {
      //   const index = this.txHashToIndex[receipt.transactionHash]
      //   this.txs[index].status = `mined`
      //   console.log(receipt)
        
      // })
      .on('transactionHash', (hash) => {
        console.log('txHash',hash)
        this.txHashToIndex[hash] = this.txs.length
        this.txs.push({status: 'pending', name: `Sending Batch #${this.txs.length} ${this.tokenStore.tokenSymbol}`, hash})
        this.getTxReceipt(hash)
  
      })
      .on('error', (error) => {
        console.log(error)
        // swal("Error!", `Something went wrong!\n ${error}`, "error");
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
    const web3 = this.web3Store.web3;
    web3.eth.getTransaction(hash, (error, res) => {
      console.log(hash, res)
      if(res && res.blockNumber){
        const index = this.txHashToIndex[hash]
        this.txs[index].status = `mined`
      } else {
        console.log('not mined yet', hash)
        setTimeout(() => {
          this.getTxReceipt(hash)
        }, 5000)
      }
    })
  }

}

export default TxStore;