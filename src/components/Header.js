import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => (
  <header className="header">
    <div className="container">
      <a href="#" className="header-logo"></a>
      <form className="form form_header">
      
        <label htmlFor="network" className="label">MultiSender Address: {process.env.REACT_APP_PROXY_MULTISENDER}</label>
        {/* <select id="network" className="select">
          <option value="">YourTokens</option>
          <option value="">YourTokens 1</option>
          <option value="">YourTokens 2</option>
        </select> */}
        <div className="socials">
        <a href="https://github.com/poanetwork/multisender/issues" target="_blank" className="socials-i socials-i_github"></a>
      </div>
      </form>
    </div>
  </header>
);