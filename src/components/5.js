import React from 'react';
import { Link } from 'react-router-dom';

export class FifthStep extends React.Component {
  render () {
    return (
      <div className="container container_bg container_opacity">
        <div className="content">
          <div className="transactions-title">
            <h1 className="title"><strong>Table Name</strong></h1>
            <p className="title">Total: <strong>3789.093 ETH</strong></p>
          </div>
          <div className="table">
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