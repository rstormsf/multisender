import { action, observable, computed } from "mobx";
import Web3Utils from 'web3-utils';

class GasPriceStore {
  @observable gasPrices = {};
  @observable loading = true;
  @observable gasPricesArray = [
    {label: 'fast', value: '21'},
    {label: 'standard', value: '21'},
    {label: 'slow', value: '21'},
    {label: 'instant', value: '21'},
  ];
  @observable selectedGasPrice = '22'
  gasPricePromise = null;
  constructor(rootStore) {
    this.getGasPrices()
  }

  async getGasPrices(){
    this.gasPricePromise = fetch('https://gasprice.poa.network/').then((response) => {
      return response.json()
    }).then((data) => {
      this.gasPricesArray.map((v) => {
        v.value = data[v.label]
        v.label = `${v.label}: ${data[v.label]} gwei`
        return v;
      })
      this.selectedGasPrice = data.fast;
      this.gasPrices = data;
      this.loading = false;
    }).catch((e) => {
      this.loading = true;
      console.error(e)
    })
  }

  @computed get standardInHex() {
    const toWei = Web3Utils.toWei(this.selectedGasPrice.toString(), 'gwei')
    return Web3Utils.toHex(toWei)
  }
  @action
  setSelectedGasPrice(value) {
    this.selectedGasPrice = value;
  }

}

export default GasPriceStore;