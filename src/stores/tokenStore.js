import { action, observable, computed } from "mobx";
import ERC20ABI from '../abis/ERC20ABI'
import StormMultiSenderABI from '../abis/StormMultisender'
import Web3Utils from 'web3-utils';

const BN = require('bignumber.js');
function add(a, b) {
  return new BN(a).plus(new BN(b));
}
class TokenStore {
  @observable decimals = '';
  @observable jsonAddresses = [{"0x0": "0"}];
  @observable tokenAddress = '';
  @observable defAccTokenBalance = ''
  @observable allowance = ''
  @observable currentFee = ''
  @observable tokenSymbol = ''
  @observable ethBalance = ''
  @observable balances_to_send = []
  @observable addresses_to_send = []
  @observable invalid_addresses = []
  @observable filteredAddresses = []
  @observable totalBalance = '0'
  @observable arrayLimit = 0
  @observable errors = []
  proxyMultiSenderAddress = process.env.REACT_APP_PROXY_MULTISENDER
  
  constructor(rootStore) {
    this.web3Store = rootStore.web3Store;
    this.gasPriceStore = rootStore.gasPriceStore;

  }

  @action
  async getDecimals(address) {
    try{ 
      const web3 = this.web3Store.web3;
      const token = new web3.eth.Contract(ERC20ABI, address);
      this.decimals = await token.methods.decimals().call();
      return this.decimals
    } catch(e) {
      this.errors.push('Cannot get decimals for token contract.\n Please make sure you are on the right network and token address exists')
      console.error('Get Decimals', e)
    }
  }

  async getBalance() {
    try {
        const web3 = this.web3Store.web3;
        const token = new web3.eth.Contract(ERC20ABI, this.tokenAddress);
        const defAccTokenBalance = await token.methods.balanceOf(this.web3Store.defaultAccount).call();
        this.defAccTokenBalance = new BN(defAccTokenBalance).div(this.multiplier).toString(10)
        return this.defAccTokenBalance
    }
    catch(e){
      this.errors.push(`${this.web3Store.defaultAccount} doesn't have token balance.\n Please make sure you are on the right network and token address exists`)
      console.error('getBalance',e)
    }
  }
  async getEthBalance() {
    try {
      const web3 = this.web3Store.web3;
      let ethBalance =  await web3.eth.getBalance(this.web3Store.defaultAccount)
      ethBalance = Web3Utils.fromWei(ethBalance)
      this.ethBalance = new BN(ethBalance).toFormat(3)
      return this.ethBalance
    }
    catch(e){
      console.error(e)
    }
  }
  async getTokenSymbol(tokenAddress) {
    try {
      const web3 = this.web3Store.web3;
      const token = new web3.eth.Contract(ERC20ABI, tokenAddress);
      this.tokenSymbol = await token.methods.symbol().call();
      return this.tokenSymbol
    }
    catch(e){
      this.errors.push('Token with this Address doesnt exist.\n Please make sure you are on the right network and token address exists')
      console.error(e)
    }
  }
  @action
  async getAllowance() {
    try {
      const web3 = this.web3Store.web3;
      const token = new web3.eth.Contract(ERC20ABI, this.tokenAddress);
      const allowance = await token.methods.allowance(this.web3Store.defaultAccount, this.proxyMultiSenderAddress).call();
      this.allowance = new BN(allowance).div(this.multiplier).toString(10)
      return this.allowance
    }
    catch(e){
      this.errors.push(`Token address doesn't have allowance method.\n Please make sure you are on the right network and token address exists.\n
         Your account: ${this.web3Store.defaultAccount}`)
      console.error('GetAllowance',e)
    }
  }

  @action
  async getCurrentFee(){
    try {
      this.web3Store.getWeb3Promise.then(async () => {
        const web3 = this.web3Store.web3;
        const multisender = new web3.eth.Contract(StormMultiSenderABI, this.proxyMultiSenderAddress);
        const currentFee = await multisender.methods.currentFee(this.web3Store.defaultAccount).call();
        this.currentFee = Web3Utils.fromWei(currentFee)
        return this.currentFee
      }) 
    }
    catch(e){
      console.error('getCurrentFee',e)
    }
  }

  async getArrayLimit(){
    try {
      await this.web3Store.getWeb3Promise.then(async () => {
        const web3 = this.web3Store.web3;
        const multisender = new web3.eth.Contract(StormMultiSenderABI, this.proxyMultiSenderAddress);
        this.arrayLimit = await multisender.methods.arrayLimit().call();
        return this.arrayLimit
      }) 
    }
    catch(e){
      console.error('GetArrayLimit', e)
    }
  }

  @action
  async setTokenAddress(tokenAddress) {
    await this.web3Store.getWeb3Promise.then(async () => {
      if(Web3Utils.isAddress(this.web3Store.defaultAccount) && tokenAddress !== "0x000000000000000000000000000000000000bEEF"){
        this.tokenAddress = tokenAddress;
        await this.getDecimals(tokenAddress)
        await this.getBalance()
        await this.getAllowance()
        await this.getCurrentFee()
        this.getTokenSymbol(tokenAddress)
        this.getEthBalance()
        this.getArrayLimit()
      } else {
        this.tokenAddress = tokenAddress;
        await this.getCurrentFee()
        await this.getEthBalance()
        this.getArrayLimit()
        this.decimals = 18;
        this.defAccTokenBalance = this.ethBalance;
      }
    })
  }

  setDecimals(decimals) {
    this.decimals = decimals;
  }

  setJsonAddresses(addresses){
    this.jsonAddresses = addresses;
  }

  @action
  parseAddresses(){
    const newAddresses = []
    this.jsonAddresses.forEach((account) => {
      const address = Object.keys(account)[0].replace(/\s/g, "");;
      if(!Web3Utils.isAddress(address)){
        this.invalid_addresses.push(address);
      } else {
        this.addresses_to_send.push(address);
        let balance = Object.values(account)[0];
        this.totalBalance = new BN(balance).plus(this.totalBalance).toString(10)
        const acc = {}
        acc[`"${address}"`] = balance
        newAddresses.push(acc)
        balance = this.multiplier.times(balance);
        this.balances_to_send.push(balance.toString(10))
      }
    })
    this.jsonAddresses = newAddresses
    if(this.tokenAddress === "0x000000000000000000000000000000000000bEEF") {
      this.allowance = this.totalBalance
    }
  }

  @computed get totalBalanceWithDecimals() {
    return new BN(this.totalBalance).times(this.multiplier).toString(10)
  }
  @computed get multiplier(){
    const decimals = Number(this.decimals)
    return new BN(10).pow(decimals)
  }

  @computed get totalNumberTx() {
    return Math.ceil(this.jsonAddresses.length/this.arrayLimit);
  }

  @computed get totalCostInEth(){
    const standardGasPrice = Web3Utils.toWei(this.gasPriceStore.gasPrices.fast.toString(), 'gwei');
    const currentFeeInWei = Web3Utils.toWei(this.currentFee);
    const tx = new BN(standardGasPrice).times(new BN('6000000'))
    const txFeeMiners = tx.times(new BN(this.totalNumberTx))
    const contractFee = new BN(currentFeeInWei).times(this.totalNumberTx);
    
    return Web3Utils.fromWei(txFeeMiners.plus(contractFee).toString(10))
  }

}

export default TokenStore;