import React from 'react';

export default class Header extends React.Component {

  render() {
    return (
      <header className="header">
        <div className="header-contents">
          <span>
            <i className="fas fa-dollar-sign"></i>
          </span>
          Wicked Sales
        </div>
      </header>
    );
  }
}
