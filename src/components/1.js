import React from 'react';
import { Link } from 'react-router-dom';

export class FirstStep extends React.Component {
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
            <label htmlFor="addresses-with-balances" className="label">Addresses with Balances</label>
            <textarea id="addresses-with-balances" className="textarea"></textarea>
            <Link className="button button_next" to='/2'>Check Information</Link>
          </form>
        </div>
      </div>
    );
  }
}