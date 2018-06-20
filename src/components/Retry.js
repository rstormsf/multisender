import React from 'react';
import { inject, observer } from "mobx-react";
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import generateElement from '../generateElement'

@inject("UiStore")
@observer
export class Retry extends React.Component {
  constructor(props) {
    super(props)
    this.onTxInput = this.onTxInput.bind(this)
    this.txStore = props.UiStore.txStore;
    
    this.state = {
      txHash: ''
    }
  }
  
  onTxInput(e){
    const txHash = e.target.value;
    setTimeout(async () => {
      if(txHash.length === 66){
        // https://kovan.etherscan.io/tx/0x234cb7950c9239ce64033647e14b8fdd915106cad24c8ae57b0eb9052e8ec79a
        const txdata = await this.txStore.getTxReceipt(txHash);
        console.log(txdata)
        this.setState({txHash})
      } else {
        swal({
          content: generateElement(`Tx Hash is not valid`),
          icon: "error",
        })
      }

    }, 750)
  }
  render () {
    return (
      <div className="container container_bg container_opacity">
        <div className="content">
          <div className="table">
            <label htmlFor="txhash" className="label">Transaction Hash</label>
            <input onChange={this.onTxInput} type="text" className="input" id="txhash"/>
            <div className="table-tr table-tr_title">
              <div className="table-td">Token Name</div>
              <div className="table-td">Address</div>
              <div className="table-td">Amount</div>
            </div>
            <div className="table-tr">
              <div className="table-td">
                <p>Name 1</p>
              </div>
              <div className="table-td">
                <p className="break-all">0xc6300135a8fcd43123bb486ff06831b5345d0971</p>
              </div>
              <div className="table-td">
                <p>2.5672 ETH</p>
              </div>
            </div>
            <div className="table-tr">
              <div className="table-td">
                <p>Name 2</p>
              </div>
              <div className="table-td">
                <p className="break-all">0x0a7772cdbeee6dbdfdf944dd3e11d32d6a183bde</p>
              </div>
              <div className="table-td">
                <p>8.009 ETH</p>
              </div>
            </div>
          </div>
          <Link className="button button_next" to='/'>Back to Home</Link>
        </div>
      </div>
    );
  }
}