import React from 'react';
import { Link } from 'react-router-dom';

export class FourthStep extends React.Component {
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
            <p>Please wait...</p>
            <div className="table">
              <div className="table-tr">
                <div className="table-td table-td_check-hash table-td_check-hash_wait">
                  0xda42dfb137840c37a351eda6a10f3a39d62f60d5
                </div>
              </div>
              <div className="table-tr">
                <div className="table-td table-td_check-hash table-td_check-hash_done">
                  0xda42dfb137840c37a351eda6a10f3a39d62f60d5
                </div>
              </div>
              <div className="table-tr">
                <div className="table-td table-td_check-hash table-td_check-hash_wait">
                  0xda42dfb137840c37a351eda6a10f3a39d62f60d5
                </div>
              </div>
            </div>
            <Link className="button button_next" to='/5'>Back to Home</Link>
          </form>
        </div>
      </div>
    );
  }
}