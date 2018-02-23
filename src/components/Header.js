import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => (
  <header className="header">
    <div className="container">
      <a href="#" className="header-logo"></a>
      <form className="form form_header">
        <label htmlFor="network" className="label">Network</label>
        <select id="network" className="select">
          <option value="">YourTokens</option>
          <option value="">YourTokens 1</option>
          <option value="">YourTokens 2</option>
        </select>
      </form>
    </div>
  </header>
);