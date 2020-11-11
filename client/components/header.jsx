import React from 'react';

export default function Header(props) {

  return (
    <header className="header">
      <div className="header-contents">
        <span>
          <i className="fas fa-dollar-sign"></i>
        </span>
        Wicked Sales
      </div>
      <a onClick={() => props.setView('cart', {})}>items {`${props.cartItemCount}`}</a>
    </header>
  );
}
