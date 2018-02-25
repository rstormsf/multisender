import { action, observable, computed } from "mobx";
import ERC20ABI from '../abis/ERC20ABI'
import Web3Utils from 'web3-utils';
const BN = Web3Utils.BN;
function add(a, b) {
  return new BN(a).add(new BN(b));
}
class TokenStore {
  @observable decimals = '';
  @observable jsonAddresses = [];
  @observable tokenAddress = '';
  @observable defAccTokenBalance = ''
  constructor(rootStore) {
    this.web3Store = rootStore.web3Store;
  }

  @action
  async getDecimals(address) {
    try{ 
      const web3 = this.web3Store.web3;
      const token = new web3.eth.Contract(ERC20ABI, address);
      this.decimals = await token.methods.decimals().call();
      return this.decimals
    } catch(e) {
      console.error(e)
    }
  }

  async getBalance() {
    try {
      const web3 = this.web3Store.web3;
      const token = new web3.eth.Contract(ERC20ABI, this.tokenAddress);
      this.defAccTokenBalance = await token.methods.balanceOf(this.web3Store.defaultAccount).call();
      return this.defAccTokenBalance
    }
    catch(e){
      console.error(e)
    }
  }

  @action
  setTokenAddress(tokenAddress) {
    this.tokenAddress = tokenAddress;
    this.getBalance()
  }

  setDecimals(decimals) {
    this.decimals = decimals;
  }

  setJsonAddresses(addresses){
    this.jsonAddresses = addresses;
  }
  @computed get totalBalance() {
    return this.jsonAddresses.slice().map((v) => {
      return Object.values(v)[0];
    }).reduce(add).toString(10)
  }

}

export default TokenStore;