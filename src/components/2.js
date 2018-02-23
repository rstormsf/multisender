import React from 'react';
import { Link } from 'react-router-dom';

export class SecondStep extends React.Component {
  render () {
    return (
      <div className="container container_bg">
        <div className="content">
          <h1 className="title"><strong>Welcome to Token</strong> MultiSender</h1>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore <a href="#">et dolore magna</a> aliqua.
          </p>
          <form className="form">
            <div className="form-inline">
              <div className="form-inline-i form-inline-i_token-address">
                <label htmlFor="token-address" className="label">Token Address</label>
                <input type="text" className="input" id="token-address"/>
              </div>
              <div className="form-inline-i form-inline-i_token-decimals">
                <label htmlFor="token-decimals" className="label">Token Decimals</label>
                <input type="text" className="input" id="token-decimals"/>
              </div>
            </div>
            <div className="form-inline">
              <div className="form-inline-i form-inline-i_balance">
                <label htmlFor="balance" className="label">Balance</label>
                <input type="text" className="input" id="balance"/>
              </div>
              <div className="form-inline-i form-inline-i_balance">
                <label htmlFor="address-balance" className="label">Address with Balance</label>
                <input type="text" className="input" id="address-balance"/>
              </div>
              <button type="button" className="button button_add"></button>
            </div>
            <div className="table">
              <div className="table-tr">
                <p className="table-td">0.5 ETH</p>
                <p className="table-td table-td_hash">0xf3a71cc1be5ce833c471e3f25aa391f9cd56e1aa</p>
                <div className="table-td">
                  <a href="#" className="table-remove"></a>
                </div>
              </div>
              <div className="table-tr">
                <p className="table-td">2.001 ETH</p>
                <p className="table-td table-td_hash">0x67de6a531b58327d075535e89524be5c5672f16b</p>
                <div className="table-td">
                  <a href="#" className="table-remove"></a>
                </div>
              </div>
            </div>
            <Link className="button button_next" to='/3'>Check Information</Link>
          </form>
        </div>
      </div>
    );
  }
}