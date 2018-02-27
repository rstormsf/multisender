import { action, observable } from "mobx";
import getWeb3 from '../getWeb3';
import Web3 from 'web3';
class Web3Store {
  @observable web3 = {};
  @observable defaultAccount = '';
  getWeb3Promise = null;
  constructor(rootStore) {
    //TODO ADD LOADING
    this.getWeb3Promise = getWeb3().then(async (web3Config) => {
      const {web3Instance, defaultAccount} = web3Config;
      this.web3 = new Web3(web3Instance.currentProvider); 
      this.defaultAccount = defaultAccount;
    })
  }

}

export default Web3Store;