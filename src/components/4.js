import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from "mobx-react";
import swal from 'sweetalert';


const Transaction = (tx) => {
  const {name, hash, status} = tx.tx;
  console.log(tx)
  let classname;
  switch(status){
    case 'mined':
      classname = 'table-td_check-hash_done'
      break;
    case 'error':
      classname = 'table-td_check-hash_error'
      break;
    case 'pending':
      classname = 'table-td_check-hash_wait'
      break;
    default:
      classname = 'table-td_check-hash_wait'
  }
  // const classname = status === 'mined' ? 'table-td_check-hash_done' : 'table-td_check-hash_wait'
  return (
    <div className="table-tr">
      <div className={`table-td table-td_check-hash ${classname}`}>
        TxHash: {hash} <br/> {name} <br/> Status: {status}
      </div>
    </div>
  )
}
@inject("UiStore")
@observer
export class FourthStep extends React.Component {
  constructor(props){
    super(props);
    this.txStore = props.UiStore.txStore;
    this.totalNumberTx = props.UiStore.tokenStore.totalNumberTx;
    this.state = {
      txCount: Number(this.totalNumberTx)
    }
  }
  componentDidMount(){
    this.txStore.doSend()
  }
  render () {
    const txHashes = this.txStore.txs.map((tx, index) => {
      console.log(tx)
      return <Transaction key={index} tx={{...tx}}/>
    })
    let status;
    if(this.txStore.txs.length === Number(this.totalNumberTx) + 1){
      status =  "Transactions were sent out. Now wait until all transactions are mined."
    } else {
      const txCount = Number(this.totalNumberTx) - this.txStore.txs.length + 1
      status = `Please wait...until you sign ${txCount} transactions in Metamask`
    }
    return (
      <div className="container container_bg">
        <div className="content">
          <h1 className="title"><strong>Welcome to Token</strong> MultiSender</h1>
          <p className="description">
            Please provide Token Address, JSON file with addresses <br />
            This Dapp supports Mainnet, POA-Core, POA-sokol, Ropsten, Rinkeby, Kovan
          </p>
          <form className="form">
            <p>{status}</p>
            <div className="table">
              {txHashes}
            </div>
            {/* <Link className="button button_next" to='/5'>Back to Home</Link> */}
          </form>
        </div>
      </div>
    );
  }
}