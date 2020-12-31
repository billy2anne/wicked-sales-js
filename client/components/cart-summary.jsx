import React from 'react';
import CartSummaryItem from './cart-summary-item';

export default function CartSummary(props) {
  let total = 0;
  let cartView = null;
  if (props.cart.length === 0) {
    cartView = <div className="row"><span>Your Cart is empty</span></div>;
  } else {
    cartView = <div className="row mb-3">
      {
        props.cart.map(product => {
          total = total + product.price;
          return (
            <CartSummaryItem
              key={product.cartItemId}
              img={product.image}
              name={product.name}
              price={product.price}
              short={product.shortDescription}
            />
          );
        })
      }
    </div>;
  }
  return (
    <div className="container">
      <a onClick={() => props.view('catalog', {})} className="row my-3 back text-muted">&lt; Back to catalog</a>
      <h2 className="row mb-4">My Cart</h2>
      {cartView}
      <h3 className="row pb-3">
        Item Total:${total / 100}
        <button onClick={() => props.view('checkout', {})}>Place Order</button>
      </h3>
    </div>
  );
}
