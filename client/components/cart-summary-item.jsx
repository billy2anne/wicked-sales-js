import React from 'react';

export default function CartSummaryItem(props) {
  const totalPrice = this.props.CartItem.price;

  return (
    <>
      <div>
        Cart Summary Page
      </div>
      <div>
        {totalPrice}
      </div>
    </>
  );
}
