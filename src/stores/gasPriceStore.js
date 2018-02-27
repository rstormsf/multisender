import { action, observable, computed } from "mobx";
import Web3Utils from 'web3-utils';

class GasPriceStore {
  @observable gasPrices = {};
  gasPricePromise = null;
  constructor(rootStore) {
    this.getGasPrices()
  }

  async getGasPrices(){
    this.gasPricePromise = fetch('https://gasprice.poa.network/').then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
      this.gasPrices = data;
    }).catch((e) => {
      console.error(e)
    })
  }

  @computed get standardInHex() {
    const toWei = Web3Utils.toWei(this.gasPrices.instant.toString(), 'gwei')
    return Web3Utils.toHex(toWei)
  }

}

export default GasPriceStore;