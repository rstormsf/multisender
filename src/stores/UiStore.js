import Web3Store from './web3Store'
import TokenStore from './tokenStore';

class UiStore {
  constructor() {
    this.web3Store = new Web3Store(this)
    this.tokenStore = new TokenStore(this)
  }
}

export default new UiStore();