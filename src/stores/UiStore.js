import Web3Store from './web3Store'
import TokenStore from './tokenStore';
import GasPriceStore from './gasPriceStore';
import TxStore from './txStore';

class UiStore {
  constructor() {
    this.gasPriceStore = new GasPriceStore()
    this.web3Store = new Web3Store(this)
    this.tokenStore = new TokenStore(this)
    this.txStore = new TxStore(this)
  }
}

export default new UiStore();