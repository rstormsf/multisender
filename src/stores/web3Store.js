import { action, observable } from "mobx";
import getWeb3 from '../getWeb3';
import Web3 from 'web3';
class Web3Store {
  @observable web3 = {};
  @observable defaultAccount = '';
  getWeb3Promise = null;
  @observable loading = true;
  @observable errors = [];
  @observable userTokens = [];
  constructor(rootStore) {
    //TODO ADD LOADING
    this.getWeb3Promise = getWeb3().then(async (web3Config) => {
      const {web3Instance, defaultAccount} = web3Config;
      this.defaultAccount = defaultAccount;
      this.web3 = new Web3(web3Instance.currentProvider); 
      this.getUserTokens(web3Config)
      console.log('web3 loaded')
    }).catch((e) => {
      console.error(e,'web3 not loaded')
      this.errors.push(e.message)
    })
  }
  async getUserTokens({trustApiName, defaultAccount}) {
    window.fetch(`https://${trustApiName}.trustwalletapp.com/tokens?address=${defaultAccount}`).then((res) => {
      return res.json()
    }).then((res) => {
      const tokens = res.docs.map(({contract}) => {
        const {address, symbol} = contract;
        return {label: `${symbol} - ${address}`, value: address}
      })
      this.userTokens = tokens;
      this.loading = false;
    }).catch((e) => {
      this.loading = false;
      console.error(e);
    })
  }

}

export default Web3Store;