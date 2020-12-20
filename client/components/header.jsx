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
      <a>
        items {`${props.cartItemCount}`}
        <i className="fas fa-shopping-cart" onClick={() => props.view('cart', {})} ></i>
      </a>
    </header>
  );
}
